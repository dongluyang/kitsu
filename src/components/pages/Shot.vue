<template>
<div class="columns fixed-page shot">
  <div class="column main-column">
    <div class="page-header flexrow">
      <router-link
        class="flexrow-item has-text-centered back-link"
        :to="getShotsRoute"
      >
        <chevron-left-icon />
      </router-link>
      <entity-thumbnail
        class="shot-thumbnail flexrow-item"
        :entity="currentShot"
        :with-link="false"
        v-if="currentShot"
      />
      <div class="flexrow-item">
        <page-title :text="title" class="entity-title" />
      </div>
      <div class="flexrow-item">
        <button-simple
          icon="edit"
          @click="modals.edit = true"
          v-if="isCurrentUserManager"
        />
      </div>
    </div>

    <div class="flexrow infos">
      <div class="flexrow-item">
      <page-subtitle :text="$t('shots.tasks')" />
      <entity-task-list
        class="task-list"
        :entries="currentTasks.map(t => t.id)"
        :is-loading="!currentShot"
        :is-error="false"
        @task-selected="onTaskSelected"
      />
      </div>
      <div class="flexrow-item">
        <page-subtitle :text="$t('main.info')" />
        <div class="table-body">
          <table class="datatable" v-if="currentShot">
            <tbody class="datatable-body">
              <tr
                class="datatable-row"
                v-if="currentShot.data && currentShot.data.fps"
              >
                <td class="field-label">{{ $t('shots.fields.fps') }}</td>
                <td>
                  {{ currentShot ? currentShot.data.fps : '' }}
                </td>
              </tr>

              <tr
                class="datatable-row"
                v-if="currentShot.data && currentShot.data.frame_in"
              >
                <td class="field-label">{{ $t('shots.fields.frame_in') }}</td>
                <td>
                  {{ currentShot ? currentShot.data.frame_in : '' }}
                </td>
              </tr>

              <tr
                class="datatable-row"
                v-if="currentShot.data && currentShot.data.frame_out"
              >
                <td class="field-label">{{ $t('shots.fields.frame_out') }}</td>
                <td>
                  {{ currentShot ? currentShot.data.frame_out : '' }}
                </td>
              </tr>

              <tr
                class="datatable-row"
              >
                <td class="field-label">{{ $t('shots.fields.description') }}</td>
                <description-cell
                  :entry="currentShot"
                  :full="true"
                />
              </tr>

              <tr
                class="datatable-row"
              >
                <td class="field-label">{{ $t('shots.fields.nb_frames') }}</td>
                <td>
                  {{ currentShot ? currentShot.nb_frames : '' }}
                </td>
              </tr>

              <tr
                :key="descriptor.id"
                class="datatable-row"
                v-for="descriptor in shotMetadataDescriptors"
              >
                <td class="field-label">{{ descriptor.name }}</td>
                <td>
                  {{ currentShot.data ? currentShot.data[descriptor.field_name] : '' }}
                </td>
              </tr>

            </tbody>
        </table>
      </div>
      </div>
    </div>

    <div class="infos schedule" v-if="scheduleItems.length > 0">
      <page-subtitle class="schedule-title" text="Schedule" />
      <div class="wrapper">
        <schedule
          ref="schedule-widget"
          class="schedule-widget"
          :start-date="tasksStartDate"
          :end-date="tasksEndDate"
          :hierarchy="scheduleItems"
          :zoom-level="2"
          :height="385"
          :is-loading="false"
          :is-estimation-linked="true"
          :hide-root="true"
          :with-milestones="false"
        />
      </div>
    </div>

    <div class="shot-casting">
      <page-subtitle :text="$t('shots.casting')" />
      <div v-if="currentShot">
        <div
            v-if="currentShot.castingAssetsByType && currentShot.castingAssetsByType[0].length > 0"
        >
          <div
            class="type-assets"
            :key="typeAssets.length > 0 ? typeAssets[0].asset_type_name : ''"
            v-for="typeAssets in currentShot.castingAssetsByType"
          >
            <div class="asset-type">
              {{ typeAssets.length > 0 ? typeAssets[0].asset_type_name : '' }}
              ({{ typeAssets.length }})
            </div>
            <div class="asset-list">
              <router-link
                class="asset-link"
                :key="asset.id"
                :to="buildAssetRoute(asset)"
                v-for="asset in typeAssets"
              >
                <entity-thumbnail
                  :entity="asset"
                  :square="true"
                  :empty-width="103"
                  :empty-height="103"
                  :with-link="false"
                />
                <div>
                  <span>{{ asset.asset_name }}</span>
                  <span v-if="asset.nb_occurences > 1">
                    ({{ asset.nb_occurences }})
                  </span>
                </div>
                <div
                  class="ready-for flexrow"
                >
                  <task-type-name
                    class="flexrow-item"
                    :task-type="taskTypeMap.get(asset.ready_for)"
                    :current-production-id="currentProduction.id"
                    :title="'Ready for: ' + taskTypeMap.get(asset.ready_for).name"
                    v-if="asset.ready_for"
                  />
                </div>
              </router-link>
            </div>
          </div>
        </div>
        <div v-else>
          {{ $t('shots.no_casting') }}
        </div>
      </div>
      <table-info
        :is-loading="casting.isLoading"
        :is-error="casting.isError"
        v-else
      />
    </div>
  </div>

  <div
    class="column side-column"
    v-if="currentTask"
  >
    <task-info
      :task="currentTask"
    />
  </div>

  <edit-shot-modal
    ref="edit-shot-modal"
    :active="modals.edit"
    :is-loading="loading.edit"
    :is-error="errors.edit"
    :shot-to-edit="currentShot"
    @cancel="modals.edit = false"
    @confirm="confirmEditShot"
  />
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ChevronLeftIcon } from 'vue-feather-icons'

import { episodifyRoute } from '@/lib/path'
import { entityMixin } from '@/components/mixins/entity'
import { formatListMixin } from '@/components/mixins/format'

import ButtonSimple from '@/components/widgets/ButtonSimple'
import DescriptionCell from '@/components/cells/DescriptionCell'
import EditShotModal from '@/components/modals/EditShotModal'
import EntityThumbnail from '@/components/widgets/EntityThumbnail'
import EntityTaskList from '@/components/lists/EntityTaskList'
import PageTitle from '@/components/widgets/PageTitle'
import PageSubtitle from '@/components/widgets/PageSubtitle'
import Schedule from '../pages/schedule/Schedule'
import TableInfo from '@/components/widgets/TableInfo'
import TaskInfo from '@/components/sides/TaskInfo'
import TaskTypeName from '@/components/widgets/TaskTypeName'

export default {
  name: 'shot',
  mixins: [entityMixin, formatListMixin],
  components: {
    ButtonSimple,
    ChevronLeftIcon,
    DescriptionCell,
    EditShotModal,
    EntityThumbnail,
    EntityTaskList,
    PageSubtitle,
    PageTitle,
    Schedule,
    TableInfo,
    TaskInfo,
    TaskTypeName
  },

  data () {
    return {
      currentShot: null,
      currentTask: null,
      casting: {
        isLoading: false,
        isError: false
      },
      errors: {
        edit: false
      },
      loading: {
        edit: false
      },
      modals: {
        edit: false
      }
    }
  },

  mounted () {
    this.clearSelectedTasks()
    this.currentShot = this.getCurrentShot()

    this.casting.isLoading = true
    this.casting.isError = false

    if (this.currentShot) {
      this.loadShotCasting(this.currentShot)
        .then(() => {
          this.casting.isLoading = false
        })
        .catch((err) => {
          this.casting.isError = true
          console.error(err)
        })
    } else {
      this.resetData()
    }
  },

  computed: {
    ...mapGetters([
      'currentEpisode',
      'currentProduction',
      'getTaskTypePriority',
      'isCurrentUserManager',
      'isTVShow',
      'route',
      'shotMap',
      'shotMetadataDescriptors',
      'shotsPath',
      'taskMap',
      'taskTypeMap'
    ]),

    title () {
      if (this.currentShot) {
        if (this.currentShot.episode_name) {
          return `${this.currentShot.episode_name} / ` +
                 `${this.currentShot.sequence_name} / ` +
                 `${this.currentShot.name}`
        } else {
          return `${this.currentShot.sequence_name} / ` +
                 `${this.currentShot.name}`
        }
      } else {
        return 'Loading...'
      }
    },

    shotThumbnailPath () {
      const previewId = this.currentShot.preview_file_id
      return `/api/pictures/originals/preview-files/${previewId}.png`
    },

    isPreview () {
      return this.currentShot &&
        this.currentShot.preview_file_id &&
        this.currentShot.preview_file_id.length > 0
    },

    getShotsRoute () {
      const route = {
        name: 'shots',
        params: {
          production_id: this.currentProduction.id
        },
        query: {
          search: ''
        }
      }
      if (this.currentEpisode) {
        route.name = 'episode-shots'
        route.params.episode_id = this.currentEpisode.id
      }
      return route
    }
  },

  methods: {
    ...mapActions([
      'clearSelectedTasks',
      'editShot',
      'loadAssets',
      'loadShots',
      'loadShotCasting'
    ]),

    changeTab (tab) {
      this.selectedTab = tab
    },

    getCurrentShot () {
      return this.shotMap.get(this.route.params.shot_id) || null
    },

    onEditClicked () {
      this.modals.edit = true
    },

    confirmEditShot (form) {
      form.id = this.currentShot.id
      this.loading.edit = true
      this.errors.edit = false
      this.editShot(form)
        .then(() => {
          this.loading.edit = false
          this.modals.edit = false
        })
        .catch((err) => {
          console.error(err)
          this.loading.edit = false
          this.errors.edit = true
        })
    },

    onTaskSelected (task) {
      this.currentTask = task
    },

    buildAssetRoute (asset) {
      let episodeId = asset.episode_id
      if (this.isTVShow && !episodeId) episodeId = 'main'
      const route = {
        name: 'asset',
        params: {
          production_id: this.currentProduction.id,
          asset_id: asset.asset_id
        }
      }
      return episodifyRoute(route, episodeId)
    },

    resetData () {
      this.$nextTick(() => {
        this.loadShots(() => {
          this.loadAssets()
            .then(() => {
              this.currentShot = this.getCurrentShot()
              return this.loadShotCasting(this.currentShot)
                .then(() => {
                  this.casting.isLoading = false
                })
                .catch((err) => {
                  console.error(err)
                  this.casting.isError = true
                })
            })
        })
      })
    }
  },

  watch: { // Needed when reloading the page with F5
    currentProduction () {
      if (!this.isTVShow) this.resetData()
    },

    currentEpisode () {
      if (this.isTVShow && this.shotMap.size === 0) {
        this.resetData()
      }
    }
  },

  metaInfo () {
    return {
      title: `${this.title} - Cgyun`
    }
  }
}
</script>

<style lang="scss" scoped>
.dark .page {
  background: $dark-grey-light;
  height: 100%;
  padding-bottom: 1em;
}

.dark .page-header,
.dark .shot-casting,
.dark .infos {
  background: #46494F;
  border-color: $dark-grey;
  box-shadow: 0px 0px 6px #333;
}

.dark .wrapper {
  background: $dark-grey-2;
}

h2.subtitle {
  margin-top: 0;
  margin-bottom: 0.5em;
  font-weight: 300;
  font-size: 1.5em;
}

.page {
  background: #F9F9F9;
  padding: 0em;
}

.page-header {
  padding: 1em 1em 1em 1em;
  background: white;
  box-shadow: 0px 0px 6px #E0E0E0;
  margin-top: calc(50px + 2em);
  margin-bottom: 2em;
  margin-left: 1em;
  margin-right: 1em;
}

.infos {
  background: white;
  padding: 1em 1em 1em 1em;
  box-shadow: 0px 0px 6px #E0E0E0;
  margin-bottom: 1em;
  margin-left: 1em;
  margin-right: 1em;

  .flexrow-item {
    align-self: flex-start;
    flex: 1;
  }
}

.shot-casting {
  margin-left: 1em;
  margin-right: 1em;
  background: white;
  padding: 1em;
  box-shadow: 0px 0px 6px #E0E0E0;
}

.shot-thumbnail {
  max-width: 100px;
}

.asset-link .thumbnail-picture {
  margin-bottom: 0.5em;
}

.asset-type {
  text-transform: uppercase;
  font-size: 1.2em;
  color: var(--text);
  margin-top: 2em;
  margin-bottom: 0.4em;
}

.asset-list {
  color: var(--text);
  display: flex;
  flex-wrap: wrap;
}

.asset-link {
  color: inherit;
  margin-right: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.8em;
}

.asset-link div {
  max-width: 100px;
}

.asset-link span {
  word-wrap: break-word;
}

.field-label {
  font-weight: bold;
  width: 140px;
}

.page-header {
  align-items: center;
}

.data-list {
  max-width: 100%;
}

.page-header .thumbnail-picture {
  margin: 0 1em 0 0;
  max-width: 80px;
}

.back-link {
  padding-top: 3px;
}

.task-list {
  width: 100%;
}

.datatable-row {
  user-select: text;
}

.schedule {
  position: relative;
  height: 300px;
  padding: 10px;

  .schedule-title {
    margin-bottom: 5px;
  }

  .wrapper {
    height: 230px;
    border-radius: 10px;
  }
}

.column.main-column {
  background: var(--background-page);
  padding-bottom: 1em;
}

@media screen and (max-width: 768px) {
  .task-column {
    margin-bottom: 1em;
  }

  .column:first-child {
    margin-right: 0;
  }

  .entity-title {
    font-size: 1.3em;
    line-height: 1.5em;
  }
}
</style>
