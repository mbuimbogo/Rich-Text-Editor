<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'
import { onMounted, ref } from 'vue'
import EditorView from '@/views/EditorView.vue'

const seedMarkdownFile = '/seedContent.md'
const showSideBySide = ref(true)
const currentMarkdown = ref('') // For the top rendered pane
const markdownContent = ref('') // For the top rendered pane

const loadSeedContent = async () => {
  try {
    const response = await fetch(seedMarkdownFile)
    if (!response.ok) throw new Error('Network response was not ok.')
    const markdownContentResp = await response.text()
    markdownContent.value = markdownContentResp
    // we shall pass the markdown text as rops from parent component
    // 1. Set the editor's content.
    // editor.value.commands.setContent(markdownContent)

    // 2. ✅ Manually sync the other views with the same content on initial load.
    // currentMarkdown.value = markdownContent
    // markdownInput.value = markdownContent
  } catch (error) {
    console.error('Error loading seed content:', error)
    const errorContent = '# Welcome\n\nFailed to load seed file.'
    // editor.value.commands.setContent(errorContent)
    currentMarkdown.value = errorContent
    // markdownInput.value = errorContent
  }
}
onMounted(() => {
  loadSeedContent()
})
</script>

<template>
<EditorView :seedContent="markdownContent" />

</template>
