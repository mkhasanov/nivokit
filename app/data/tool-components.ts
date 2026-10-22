import { defineAsyncComponent, type Component } from 'vue'
import type { ToolId } from '#shared/tools'

export const toolComponents: Record<ToolId, Component> = {
  'resize-image': defineAsyncComponent(() => import('~/components/tools/ImageResizer.vue')),
}
