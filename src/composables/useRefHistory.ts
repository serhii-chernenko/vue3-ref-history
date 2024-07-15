import { ref, toValue, watch } from 'vue'
import type { Ref, MaybeRefOrGetter } from 'vue'

interface HistoryItem {
    value: MaybeRefOrGetter<string>
    timestamp: number
}

type HistoryNavigation = () => void

interface RefHistory {
    undo: HistoryNavigation
    redo: HistoryNavigation
    history: Ref<HistoryItem[]>
}

type RefHistoryFn = (theme: Ref<string>, capacity: Ref<number>) => RefHistory

export const useRefHistory: RefHistoryFn = (theme, capacity) => {
    const history = ref<HistoryItem[]>([])
    const result = ref<HistoryItem[]>(history.value)
    const allowRedo = ref(false)

    const cutResult = () => {
        allowRedo.value = false

        if (history.value.length <= toValue(capacity)) {
            result.value = history.value
        }

        result.value = history.value.slice(-toValue(capacity))
    }

    watch(
        theme,
        () => {
            history.value = result.value

            history.value.push({
                value: toValue(theme),
                timestamp: Date.now(),
            })
            cutResult()
        },
        {
            immediate: true,
        },
    )

    watch(capacity, () => cutResult())

    return {
        undo: () => {
            result.value.pop()
            allowRedo.value = true
        },
        redo: () => {
            const last = history.value.at(-1)

            if (!last || !allowRedo.value) {
                return
            }

            result.value.push(last)
            allowRedo.value = history.value.length > result.value.length
        },
        history: result,
    }
}
