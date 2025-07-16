<template>
  <v-app>
    <v-container fluid class="d-flex flex-column vh-100 pa-2">
      <!-- <v-row style="height: 40%; max-height: 40vh">
        <v-col class="h-100 py-1">
          <v-card class="d-flex flex-column h-100">
            <v-card-title class="flex-shrink-0"> Final Rendered Content </v-card-title>
            <v-divider></v-divider>
            <v-card-text
              class="flex-grow-1 overflow-y-auto html-content"
              v-html="markdownIt.render(currentMarkdown)"
            >
            </v-card-text>
          </v-card>
        </v-col>
      </v-row> -->

      <v-row class="" style="max-height: 100vh">
        <v-col  class="d-flex flex-column h-100 py-1">
          <v-card
            v-if="editor"
            class="d-flex flex-column h-100 bg-red px-0 position-relative rounded-xl"
            fluid
            rounded-xl
          >
            <!-- MD3 Toolbar Dock - Top for md+ screens -->
            <v-toolbar
              density="compact"
              flat
              class="flex-shrink-0 rounded-xl d-none d-md-flex elevation-2 toolbar-responsive"
              style="
                z-index: 10;
                background: rgba(var(--v-theme-surface), 0.95);
                backdrop-filter: blur(8px);
              "
            >
              <div class="mx-auto w-full">
                <!-- Undo/Redo - Single selection -->
                <v-btn-toggle variant="text">
                  <v-btn
                    icon="mdi-undo"
                    @click="editor.chain().focus().undo().run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                  <v-btn
                    icon="mdi-redo"
                    @click="editor.chain().focus().redo().run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                </v-btn-toggle>

                <v-divider vertical inset class="mx-2"></v-divider>

                <!-- Text formatting - Multiple selection allowed -->
                <v-btn-toggle variant="text"  multiple>
                  <v-btn
                    icon="mdi-format-bold"
                    :active="editor.isActive('bold')"
                    @click="editor.chain().focus().toggleBold().run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                  <v-btn
                    icon="mdi-format-italic"
                    :active="editor.isActive('italic')"
                    @click="editor.chain().focus().toggleItalic().run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                  <v-btn
                    icon="mdi-format-superscript"
                    :active="editor.isActive('superscript')"
                    @click="editor.chain().focus().toggleSuperscript().run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                </v-btn-toggle>

                <v-divider vertical inset class="mx-2"></v-divider>

                <!-- Block types - Single selection -->
                <v-btn-toggle variant="text">
                  <v-btn
                    icon="mdi-format-paragraph"
                    :active="editor.isActive('paragraph')"
                    @click="editor.chain().focus().setParagraph().run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                  <v-btn
                    icon="mdi-format-header-1"
                    :active="editor.isActive('heading', { level: 1 })"
                    @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                  <v-btn
                    icon="mdi-format-header-2"
                    :active="editor.isActive('heading', { level: 2 })"
                    @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                </v-btn-toggle>

                <v-divider vertical inset class="mx-2"></v-divider>

                <!-- Lists and blocks - Multiple selection allowed -->
                <v-btn-toggle variant="text">
                  <v-btn
                    icon="mdi-format-list-bulleted"
                    :active="editor.isActive('bulletList')"
                    @click="editor.chain().focus().toggleBulletList().run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                  <v-btn
                    icon="mdi-format-list-numbered"
                    :active="editor.isActive('orderedList')"
                    @click="editor.chain().focus().toggleOrderedList().run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                  <v-btn
                    icon="mdi-format-quote-close"
                    :active="editor.isActive('blockquote')"
                    @click="editor.chain().focus().toggleBlockquote().run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                  <v-btn
                    icon="mdi-code-braces"
                    :active="editor.isActive('codeBlock')"
                    @click="editor.chain().focus().toggleCodeBlock().run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                </v-btn-toggle>

                <v-divider vertical inset class="mx-2"></v-divider>

                <!-- Links - Single selection -->
                <v-btn-toggle variant="text">
                  <v-btn
                    icon="mdi-link-variant"
                    @click="setLink"
                    :active="editor.isActive('link')"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                  <v-btn
                    icon="mdi-link-variant-off"
                    @click="editor.chain().focus().unsetLink().run()"
                    :disabled="!editor.isActive('link')"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                </v-btn-toggle>
              </div>
            </v-toolbar>

            <!-- Editor Content with toolbar docked above -->
            <div class="flex-grow-1 overflow-y-auto">
              <editor-content :editor="editor" class="h-100 overflow-y-auto px-2" />
            </div>

            <!-- MD3 Floating Toolbar - Bottom fixed for sm screens -->
            <v-toolbar
              density="compact"
              flat
              class="flex-shrink-0 rounded-xl d-none d-sm-flex d-md-none elevation-8 mobile-toolbar-fixed"
              :class="{ 'toolbar-hidden': !isToolbarVisible }"
              style="background: rgba(var(--v-theme-surface), 0.95); backdrop-filter: blur(12px)"
            >
              <!-- Always visible undo/redo -->
              <div class="mx-auto w-full">
                <v-btn-toggle variant="text">
                  <v-btn
                    icon="mdi-undo"
                    @click="editor.chain().focus().undo().run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                  <v-btn
                    icon="mdi-redo"
                    @click="editor.chain().focus().redo().run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                </v-btn-toggle>
                <!-- Essential formatting first -->
                <v-btn-toggle variant="text" multiple>
                  <v-btn
                    icon="mdi-format-bold"
                    :active="editor.isActive('bold')"
                    @click="editor.chain().focus().toggleBold().run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                  <v-btn
                    icon="mdi-format-italic"
                    :active="editor.isActive('italic')"
                    @click="editor.chain().focus().toggleItalic().run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                  <v-btn
                    icon="mdi-format-superscript"
                    :active="editor.isActive('superscript')"
                    @click="editor.chain().focus().toggleSuperscript().run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                </v-btn-toggle>
                <v-btn-toggle variant="text">
                  <v-btn
                    icon="mdi-format-paragraph"
                    :active="editor.isActive('paragraph')"
                    @click="editor.chain().focus().setParagraph().run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                  <v-btn
                    icon="mdi-format-header-1"
                    :active="editor.isActive('heading', { level: 1 })"
                    @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                  <v-btn
                    icon="mdi-format-header-2"
                    :active="editor.isActive('heading', { level: 2 })"
                    @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                </v-btn-toggle>

                <!-- Lists -->
                <v-btn-toggle variant="text" class="ml-2">
                  <v-btn
                    icon="mdi-format-list-bulleted"
                    :active="editor.isActive('bulletList')"
                    @click="editor.chain().focus().toggleBulletList().run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                  <v-btn
                    icon="mdi-format-list-numbered"
                    :active="editor.isActive('orderedList')"
                    @click="editor.chain().focus().toggleOrderedList().run()"
                    size="small"
                    class="text-medium-emphasis rounded-xl"
                  ></v-btn>
                </v-btn-toggle>

                <!-- More options menu -->
                <v-menu location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      icon="mdi-dots-vertical"
                      v-bind="props"
                      size="small"
                      class="text-medium-emphasis ml-2"
                    ></v-btn>
                  </template>
                  <v-card class="pa-2" min-width="140">
                    <v-card-title class="text-subtitle-2 px-2 py-0">More Options</v-card-title>
                    <v-divider class="mb-2"></v-divider>

                    <!-- Blocks Section -->
                    <div>
                      <v-btn-toggle
                        density="compact"
                        variant="text"
                        
                        class="d-flex flex-wrap ga-5"
                      >
                        <v-btn
                          icon="mdi-format-quote-close"
                          :active="editor.isActive('blockquote')"
                          @click="editor.chain().focus().toggleBlockquote().run()"
                          size="small"
                          class="text-medium-emphasis rounded-xl"
                        ></v-btn>
                        <v-btn
                          icon="mdi-code-braces"
                          :active="editor.isActive('codeBlock')"
                          @click="editor.chain().focus().toggleCodeBlock().run()"
                          size="small"
                          class="text-medium-emphasis rounded-xl"
                        ></v-btn>
                      </v-btn-toggle>
                    </div>

                    <!-- Links Section -->
                    <div>
                   
                      <v-btn-toggle density="compact" variant="text" class="d-flex flex-wrap ga-5">
                        <v-btn
                          icon="mdi-link-variant"
                          @click="setLink"
                          :active="editor.isActive('link')"
                          size="small"
                          class="text-medium-emphasis rounded-xl"
                        ></v-btn>
                        <v-btn
                          icon="mdi-link-variant-off"
                          @click="editor.chain().focus().unsetLink().run()"
                          :disabled="!editor.isActive('link')"
                          size="small"
                          class="text-medium-emphasis rounded-xl"
                        ></v-btn>
                      </v-btn-toggle>
                    </div>
                  </v-card>
                </v-menu>
              </div>
            </v-toolbar>
  <!-- Floating Action Button - Shows when mobile toolbar is hidden -->
            <v-fab
              v-if="!isToolbarVisible"
              class="d-flex d-md-none fab-quick-access"
              location="bottom end"
              size="small"
              color="primary"
              icon="mdi-format-text"
              @click="showToolbar"
            ></v-fab>

            <!-- Compact Mobile Toolbar - For xs screens -->
            <v-toolbar
              density="compact"
              flat
              class="flex-shrink-0 rounded-xl d-flex d-sm-none elevation-8 mobile-toolbar-fixed mx-auto"
              :class="{ 'toolbar-hidden': !isToolbarVisible }"
              style="background: rgba(var(--v-theme-surface), 0.95); backdrop-filter: blur(12px)"
            >
              <!-- Always visible undo/redo -->
              <v-btn-toggle variant="text">
                <v-btn
                  icon="mdi-undo"
                  @click="editor.chain().focus().undo().run()"
                  size="small"
                  class="text-medium-emphasis rounded-xl"
                ></v-btn>
                <v-btn
                  icon="mdi-redo"
                  @click="editor.chain().focus().redo().run()"
                  size="small"
                  class="text-medium-emphasis rounded-xl"
                ></v-btn>
              </v-btn-toggle>
              <!-- Essential formatting buttons in groups -->
              <v-btn-toggle variant="text" multiple>
                <v-btn
                  icon="mdi-format-bold"
                  :active="editor.isActive('bold')"
                  @click="editor.chain().focus().toggleBold().run()"
                  size="small"
                  class="text-medium-emphasis rounded-xl"
                ></v-btn>
                <v-btn
                  icon="mdi-format-italic"
                  :active="editor.isActive('italic')"
                  @click="editor.chain().focus().toggleItalic().run()"
                  size="small"
                  class="text-medium-emphasis rounded-xl"
                ></v-btn>
              </v-btn-toggle>

              <!-- Lists -->
              <v-btn-toggle variant="text" class="ml-1">
                <v-btn
                  icon="mdi-format-list-bulleted"
                  :active="editor.isActive('bulletList')"
                  @click="editor.chain().focus().toggleBulletList().run()"
                  size="small"
                  class="text-medium-emphasis rounded-xl"
                ></v-btn>
                <v-btn
                  icon="mdi-format-list-numbered"
                  :active="editor.isActive('orderedList')"
                  @click="editor.chain().focus().toggleOrderedList().run()"
                  size="small"
                  class="text-medium-emphasis rounded-xl"
                ></v-btn>
              </v-btn-toggle>

              <!-- More options menu -->
              <v-menu location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon="mdi-dots-vertical"
                    v-bind="props"
                    size="small"
                    class="text-medium-emphasis ml-1"
                  ></v-btn>
                </template>
                <v-card class="pa-2" min-width="140">
                  <v-card-title class="text-subtitle-2 px-2 py-0">Format Options</v-card-title>
                  <v-divider></v-divider>

                  <!-- Text Format Section -->
                  <div>
                    <v-btn-toggle
                      density="compact"
                      variant="text"
                      multiple
                      class="d-flex flex-wrap ga-5"
                    >
                      <v-btn
                        icon="mdi-format-superscript"
                        :active="editor.isActive('superscript')"
                        @click="editor.chain().focus().toggleSuperscript().run()"
                        size="small"
                        class="text-medium-emphasis rounded-xl"
                      ></v-btn>
                    </v-btn-toggle>
                  </div>

                  <!-- Headings Section -->
                  <div>
                    <v-btn-toggle density="compact" variant="text" class="d-flex flex-wrap ga-6">
                      <v-btn
                        icon="mdi-format-paragraph"
                        :active="editor.isActive('paragraph')"
                        @click="editor.chain().focus().setParagraph().run()"
                        size="small"
                        class="text-medium-emphasis rounded-xl"
                      ></v-btn>
                      <v-btn
                        icon="mdi-format-header-1"
                        :active="editor.isActive('heading', { level: 1 })"
                        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                        size="small"
                        class="text-medium-emphasis rounded-xl"
                      ></v-btn>
                      <v-btn
                        icon="mdi-format-header-2"
                        :active="editor.isActive('heading', { level: 2 })"
                        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                        size="small"
                        class="text-medium-emphasis rounded-xl"
                      ></v-btn>
                    </v-btn-toggle>
                  </div>

                  <!-- Blocks Section -->
                  <div>
                    <v-btn-toggle
                      density="compact"
                      variant="text"
                      multiple
                      class="d-flex flex-wrap ga-5"
                    >
                      <v-btn
                        icon="mdi-format-quote-close"
                        :active="editor.isActive('blockquote')"
                        @click="editor.chain().focus().toggleBlockquote().run()"
                        size="small"
                        class="text-medium-emphasis rounded-xl"
                      ></v-btn>
                      <v-btn
                        icon="mdi-code-braces"
                        :active="editor.isActive('codeBlock')"
                        @click="editor.chain().focus().toggleCodeBlock().run()"
                        size="small"
                        class="text-medium-emphasis rounded-xl"
                      ></v-btn>
                    </v-btn-toggle>
                  </div>

                  <!-- Links Section -->
                  <div class="mb-3">
                    <v-btn-toggle density="compact" variant="text" class="d-flex flex-wrap ga-5">
                      <v-btn
                        icon="mdi-link-variant"
                        @click="setLink"
                        :active="editor.isActive('link')"
                        size="small"
                        class="text-medium-emphasis rounded-xl"
                      ></v-btn>
                      <v-btn
                        icon="mdi-link-variant-off"
                        @click="editor.chain().focus().unsetLink().run()"
                        :disabled="!editor.isActive('link')"
                        size="small"
                        class="text-medium-emphasis rounded-xl"
                      ></v-btn>
                    </v-btn-toggle>
                  </div>
                </v-card>
              </v-menu>
            </v-toolbar>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                @click="toggleSideBySide"
                :color="showSideBySide ? 'primary' : 'surface-variant'"
                variant="elevated"
                class="text-on-primary"
              >
                <v-icon start>{{
                  showSideBySide ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                }}</v-icon>
                {{ showSideBySide ? 'Hide Raw' : 'Show Raw' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Superscript from '@tiptap/extension-superscript'
import { Markdown } from 'tiptap-markdown'
import MarkdownIt from 'markdown-it'
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'

// --- Markdown-it Renderer ---
// Used for the top "Final Rendered Content" pane
const markdownIt = new MarkdownIt({
  html: true,
  linkify: true,
})
// Customize link rendering to open in a new tab
const defaultRender =
  markdownIt.renderer.rules.link_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }
markdownIt.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrSet('target', '_blank')
  tokens[idx].attrSet('rel', 'noopener noreferrer')
  return defaultRender(tokens, idx, options, env, self)
}
// --- End code for Markdown-it Renderer ---

//  --- Start code for tiptap editor  ---

// --- State Refs ---
// All refs required by the template are kept
const seedMarkdownFile = '/seedContent.md'
const showSideBySide = ref(true)
const currentMarkdown = ref('') // For the top rendered pane

// Toolbar visibility state
// scroll states for different contexts
const isToolbarVisible = ref(true)
const lastWindowScrollY = ref(0)
const lastEditorScrollY = ref(0)
const scrollThreshold = 10

const modelValue = defineModel<string>()

// --- Tiptap Editor ---
const editor = useEditor({
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: true,
      autolink: true,
      defaultProtocol: 'https',
    }),
    Markdown.configure({
      html: true,
      linkify: true,
    }),
    Superscript,
  ],
  onUpdate: ({ editor }) => {
    // currentMarkdown.value = editor.storage.markdown.getMarkdown() // Update the top rendered pane
    const markdown = editor.storage.markdown.getMarkdown()
  currentMarkdown.value = markdown
  modelValue.value = markdown // Expose to parent
  },
})
const props = defineProps<{
  seedContent: string
}>()
//  --- End code for tiptap editor  ---

// --- Functions Used by Template ---
// --- Scroll Handlers ---

/**
 * Handle window scroll for desktop (if needed)
 */
const handleWindowScroll = () => {
  const currentScrollY = window.scrollY
  const difference = currentScrollY - lastWindowScrollY.value

  if (Math.abs(difference) < scrollThreshold) return

  if (difference > 0 && currentScrollY > 100) {
    isToolbarVisible.value = false
  } else if (difference < 0) {
    isToolbarVisible.value = true
  }

  lastWindowScrollY.value = currentScrollY
}
/**
 * Handle scroll behavior for toolbar visibility
 */
// const handleScroll = () => {
//   const currentScrollY = window.scrollY
//   const difference = currentScrollY - lastScrollY.value

//   // Only act if scroll difference is significant
//   if (Math.abs(difference) < scrollThreshold) return

//   // Hide toolbar when scrolling down, show when scrolling up
//   if (difference > 0 && currentScrollY > 100) {
//     // Scrolling down & not at top
//     isToolbarVisible.value = false
//   } else if (difference < 0) {
//     // Scrolling up
//     isToolbarVisible.value = true
//   }

//   lastScrollY.value = currentScrollY
// }
/**
 * Handle editor scroll for mobile toolbar visibility
 */
const handleEditorScroll = (event: Event) => {
  const target = event.target as HTMLElement
  const currentScrollY = target.scrollTop
  const difference = currentScrollY - lastEditorScrollY.value

  // Only act if scroll difference is significant
  if (Math.abs(difference) < scrollThreshold) return

  // Hide toolbar when scrolling down, show when scrolling up
  if (difference > 0 && currentScrollY > 30) {
    isToolbarVisible.value = false
  } else if (difference < 0) {
    isToolbarVisible.value = true
  }

  lastEditorScrollY.value = currentScrollY
}

/**
 * Setup scroll listeners for editor content - improved version
 */
const setupScrollListeners = () => {
  nextTick(() => {
    // Wait a bit more for the editor to be fully rendered
    setTimeout(() => {
      // Target the actual scrollable container that wraps the editor
      const editorContainer = document.querySelector('.flex-grow-1.overflow-y-auto')
      
      if (editorContainer) {
        console.log('Setting up editor scroll listener') // Debug log
        editorContainer.addEventListener('scroll', handleEditorScroll, { passive: true })
      } else {
        console.warn('Editor container not found for scroll listener') // Debug log
      }
    }, 100)
  })
}

/**
 * Cleanup scroll listeners
 */
const cleanupScrollListeners = () => {
  const editorContainer = document.querySelector('.flex-grow-1.overflow-y-auto')
  if (editorContainer) {
    editorContainer.removeEventListener('scroll', handleEditorScroll)
  }
  window.removeEventListener('scroll', handleWindowScroll)
}

// Also add this method to reset toolbar visibility when FAB is clicked
const showToolbar = () => {
  isToolbarVisible.value = true
}
/**
 * Fetches seed content and populates all views.
 */
const loadSeedContent = async () => {
  if (!editor.value) return
  try {
    editor.value.commands.setContent(props.seedContent)

    // 2. ✅ Manually sync the other views with the same content on initial load.
    currentMarkdown.value = props.seedContent
    // markdownInput.value = markdownContent
  } catch (error) {
    console.error('Error loading seed content:', error)
    const errorContent = '# Welcome\n\nFailed to load seed file.'
    editor.value.commands.setContent(errorContent)
    currentMarkdown.value = errorContent
    // markdownInput.value = errorContent
  }
}
// we pass the above in a watcher
watch(() => props.seedContent, loadSeedContent)

/**
 * Toggles the visibility of the raw Markdown source pane.
 */
const toggleSideBySide = () => {
  showSideBySide.value = !showSideBySide.value
}

/**
 * Prompts user for a URL to create or update a link.
 */
const setLink = () => {
  if (!editor.value) return
  const previousUrl = editor.value.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)

  if (url === null) return // User cancelled

  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

// --- Lifecycle Hooks ---

onMounted(() => {
  loadSeedContent()
  setupScrollListeners()
  // window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
  cleanupScrollListeners()
})
</script>

<style scoped>
/*
  These :deep selectors are necessary to style the inner workings of Tiptap
  and the generated HTML. They are targeted exceptions.
*/
:deep(.ProseMirror:focus) {
  outline: none;
}
:deep(.ProseMirror) {
  min-height: 100%;
}

/* --- UNIFIED STYLING FOR RENDERED CONTENT AND EDITOR --- */

/* 1. General Text Styling */
.html-content :deep(p),
:deep(.ProseMirror p) {
  font-size: 16px;
  font-weight: 400;
  margin: 0 0 12px 0;
}

/* 2. Heading Styling */
.html-content :deep(h1),
:deep(.ProseMirror h1) {
  font-size: 32px;
  font-weight: 500;
  margin: 32px 0 12px 0;
}
.html-content :deep(h2),
:deep(.ProseMirror h2) {
  font-size: 24px;
  font-weight: 500;
  margin: 32px 0 12px 0;
}
.html-content :deep(h3),
:deep(.ProseMirror h3) {
  font-size: 20px;
  font-weight: 500;
  margin: 16px 0 12px 0;
}

/*
  3. THE FIX: Adjust list padding to align text.
  This rule targets <ul> and <ol> in both the top and bottom panes.
*/
.html-content :deep(ul),
.html-content :deep(ol),
:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
  padding-left: 24px; /* Adjust this value as needed */
}

/* 4. Ensure list items have consistent font size and spacing */
.html-content :deep(li),
:deep(.ProseMirror li) {
  font-size: 16px;
  font-weight: 400;
}

/* toolbar width responsivenss */
.toolbar-responsive {
  max-width: 70%; /* Default for md */
  margin: 0 auto;
}

@media (min-width: 1280px) {
  /* lg breakpoint */
  .toolbar-responsive {
    max-width: 50%;
  }
}

/* Fixed positioning for mobile toolbars */
.mobile-toolbar-fixed {
  position: fixed !important;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 15;
  min-width: 280px;
  max-width: 80%;
}

/* Hide toolbar when scrolling */
.toolbar-hidden {
  transform: translateX(-50%) translateY(calc(100% + 32px)) !important;
}

/* Show toolbar when focused */
.mobile-toolbar-fixed:focus-within {
  transform: translateX(-50%) translateY(0) !important;
}

/* Floating Action Button for quick toolbar access */
.fab-quick-access {
  position: fixed !important;
  bottom: 24px;
  right: 24px;
  z-index: 16;
}

/* Add bottom padding to editor content on mobile to prevent overlap with fixed toolbar */
@media (max-width: 959px) {
  .editor-content-mobile {
    padding-bottom: 80px;
  }
}
</style>
