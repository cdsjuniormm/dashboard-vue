<template>
  <div class="flex justify-center w-full h-28 bg-brand-main">
    <header-logged />
  </div>
  <div class="flex flex-col items-center justify-center h-64 bg-brand-gray">
    <h1 class="text-4xl font-black text-center text-gray-800">
      Feedbacks
    </h1>
    <p class="text-lg text-center text-gray-800 font-regular">
      Detalhes de todos os feedbacks recebidos.
    </p>
  </div>
  <div class="flex justify-center w-full pb-20">
    <div class="w-4/5 max-w-6xl py-10 grid grid-cols-4 gap-2">
      <div>
        <h1 class="text-3xl font-black text-brand-darkgray">
          Listagem
        </h1>
        <suspense>
          <template #default>
            <filters
              @select="changeFeedbacksType"
              class="mt-8 animate__animated animate__fadeIn animate__faster"
            />
          </template>
          <template #fallback>
            <filters-loading class="mt-8"/>
          </template>
        </suspense>
      </div>
      <div class="px-10 pt-20 col-span-3">
        <p
          v-if="state.hasError"
          class="text-lg text-center text-gray-800 font-regular"
        >
          Aconteceu um eroo ao carregar os feedbacks
        </p>
        <p
          v-if="!state.feedbacks.length && !state.isLoading && !state.isLoadingFeedbacks && !state.hasError"
          class="text-lg text-center text-gray-800 font-regular"
        >
          Nenhum feedback recebido
        </p>
        <feedback-card-loading v-if="state.isLoading || state.isLoadingFeedbacks"/>
        <feedback-card
          v-else
          v-for="(feedback, index) in state.feedbacks"
          :key="feedback.id"
          :is-opened="index === 0"
          :feedback="feedback"
          class="mb-8"
        />
        <feedback-card-loading v-if="state.isLoadingMoreFeedbacks"/>
      </div>
    </div>
  </div>
</template>

<script>
import { onErrorCaptured, onMounted, onUnmounted, reactive } from 'vue'
import Filters from './Filters'
import FiltersLoading from './FiltersLoading'
import HeaderLogged from '../../components/HeaderLogged'
import FeedbackCard from '../../components/FeedbackCard'
import FeedbackCardLoading from '../../components/FeedbackCard/Loading'
import services from '../../services'

export default {
  components: {
    HeaderLogged,
    Filters,
    FiltersLoading,
    FeedbackCard,
    FeedbackCardLoading
  },
  setup () {
    const state = reactive({
      hasError: false,
      isLoading: false,
      isLoadingFeedbacks: false,
      isLoadingMoreFeedbacks: false,
      feedbacks: [],
      currentFeedbackType: '',
      pagination: {
        limit: 5,
        offset: 0,
        total: 0
      }
    })
    onErrorCaptured(handleError)
    onMounted(() => {
      fetchFeedbacks()
      window.addEventListener('scroll', handleScoll, false)
    })
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScoll, false)
    })
    async function handleScoll () {
      const isBottomOfWindow = Math.ceil(
        document.documentElement.scrollTop + window.innerHeight
      ) >= document.documentElement.scrollHeight
      if (state.isLoading || state.isLoadingMoreFeedbacks) return
      if (!isBottomOfWindow) return
      if (state.feedbacks.length >= state.pagination.total) return

      try {
        state.isLoadingMoreFeedbacks = true
        const { data } = await services.feedbacks.getAll({
          ...state.pagination,
          type: state.currentFeedbackType,
          offset: (state.pagination.offset + 5)
        })
        if (data.results.length) {
          state.feedbacks.push(...data.results)
        }
        state.isLoadingMoreFeedbacks = false
        state.pagination = data.pagination
      } catch (e) {
        handleError(e)
      }
    }
    function handleError (e) {
      state.isLoading = false
      state.isLoadingFeedbacks = false
      state.isLoadingMoreFeedbacks = false
      state.hasError = !!e
    }
    async function changeFeedbacksType (type) {
      try {
        state.isLoadingFeedbacks = true
        state.pagination.limit = 5
        state.pagination.offset = 0
        state.currentFeedbackType = type
        const { data } = await services.feedbacks.getAll({
          type,
          ...state.pagination
        })
        state.feedbacks = data.results
        state.pagination = data.pagination
        state.isLoadingFeedbacks = false
      } catch (e) {
        handleError(e)
      }
    }
    async function fetchFeedbacks () {
      try {
        state.isLoading = true
        const { data } = await services.feedbacks.getAll({
          ...state.pagination,
          type: state.currentFeedbackType
        })
        state.feedbacks = data.results
        state.pagination = data.pagination
        state.isLoading = false
      } catch (e) {
        handleError(e)
      }
    }
    return {
      state,
      changeFeedbacksType
    }
  }
}
</script>

<style scoped>

</style>
