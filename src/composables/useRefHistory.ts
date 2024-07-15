import type { Ref } from 'vue'
export const useRefHistory = (theme: Ref<string>, capacity: Ref<number>) => {
    return {
        undo: () => {},
        redo: () => {},
        history: [],
    }
}
