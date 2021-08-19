<template>
  <div class="navbar">
    <aside :class="{'hidden-bar': isSidebarHidden}">
      <div>
        <router-link
           class="home-link"
           to="/"
           @click="toggleSidebar()"
        >
          <div
            class="company-logo has-text-centered"
          >
            <img
              :src="logoPath"
              v-if="organisation && organisation.has_avatar"
            />
            <img
              src="../../assets/kitsu.png"
              v-else
            />
          </div>
        </router-link>

        <section>
         <div v-if="!isCurrentUserClient">
           <h2>{{ $t('main.workspace')}}</h2>

           <p @click="toggleSidebar()">
             <router-link :to="{name: 'todos'}">
               <icon class="icon" name="check" />
               {{ $t("tasks.my_tasks") }}
             </router-link>
           </p>
           <p @click="toggleSidebar()">
             <router-link :to="{name: 'open-productions'}">
               <icon class="icon" name="film" />
               {{ $t("productions.open_productions") }}
             </router-link>
           </p>
         </div>

         <div v-if="!isCurrentUserClient && !isCurrentUserVendor">
           <h2>{{ $t('main.studio')}}</h2>

           <p @click="toggleSidebar()" v-if="isCurrentUserAdmin">
             <router-link :to="{name: 'productions'}">
               <icon class="icon" name="film" size="0.9x" />
               {{ $t("productions.title") }}
             </router-link>
           </p>

           <p @click="toggleSidebar()" v-if="isCurrentUserAdmin">
             <router-link :to="{name: 'people'}">
               <icon class="icon" name="users" size="0.9x" />
               {{ $t("people.title") }}
             </router-link>
           </p>

           <p @click="toggleSidebar()">
             <router-link :to="{name: 'timesheets'}">
               <icon class="icon" name="clock" size="0.9x" />
               {{ $t("timesheets.title") }}
             </router-link>
         </p>

           <p @click="toggleSidebar()" v-if="isCurrentUserAdmin">
             <router-link :to="{name: 'main-schedule'}">
               <icon class="icon" name="calendar" size="0.9x" />
               {{ $t("schedule.title_main") }}
             </router-link>
           </p>
         </div>

         <div v-if="isCurrentUserAdmin">
           <h2>{{ $t('main.admin')}}</h2>
           <p @click="toggleSidebar()">
             <router-link :to="{name: 'departments'}">
               <icon class="icon" name="hexagon" size="0.9x" />
               {{ $t("departments.title") }}
             </router-link>
           </p>
           <p @click="toggleSidebar()">
             <router-link to="/task-types">
               <icon class="icon" name="copy" size="0.9x" />
               {{ $t("task_types.title") }}
             </router-link>
           </p>
           <p @click="toggleSidebar()">
             <router-link to="/task-status" class="task-status-link">
               <icon class="icon" name="award" size="0.9x" />
               {{ $t("task_status.title") }}
             </router-link>
           </p>
           <p @click="toggleSidebar()">
             <router-link to="/asset-types">
               <icon class="icon" name="box" size="0.9x" />
               {{ $t("asset_types.title") }}
             </router-link>
           </p>
           <p @click="toggleSidebar()">
             <router-link :to="{name: 'custom-actions'}">
               <icon class="icon" name="git-pull-request" size="0.9x" />
               {{ $t("custom_actions.title") }}
             </router-link>
           </p>
           <p @click="toggleSidebar()">
             <router-link :to="{name: 'settings'}">
               <icon class="icon" name="settings" size="0.9x" />
               {{ $t("settings.title") }}
             </router-link>
           </p>
           <p @click="toggleSidebar()">
             <router-link :to="{name: 'logs'}">
               <icon class="icon" name="list" size="0.9x" />
               {{ $t("logs.title") }}
             </router-link>
           </p>
         </div>

        </section>
      </div>
    </aside>
    <div id="c-mask" @click="toggleSidebar()"
         v-bind:class="{'is-active': !isSidebarHidden}"
    >
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Icon from '@/components/widgets/Icon'

export default {
  name: 'sidebar',
  components: {
    Icon
  },

  data () {
    return {
      title: '',
      logoPath: ''
    }
  },

  mounted () {
    this.reset()
  },

  computed: {
    ...mapGetters([
      'isSidebarHidden',
      'isCurrentUserAdmin',
      'isCurrentUserClient',
      'isCurrentUserManager',
      'isCurrentUserVendor',
      'organisation'
    ])
  },

  methods: {
    ...mapActions([
      'toggleSidebar'
    ]),

    reset () {
      this.title = this.organisation.name
      this.logoPath = '/api/pictures/thumbnails/organisations/' +
        `${this.organisation.id}.png?t=` + new Date().toISOString()
    }
  },

  watch: {
    organisation () {
      this.reset()
    }
  }
}
</script>

<style lang="scss" scoped>
.dark aside {
  background-color: #2F3136;
  color: $white-grey;

  a {
    color: $white-grey;
  }

  p:hover {
    background: $dark-grey-light;
  }
}

aside {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 230px;
  background-color: white;
  padding: 15px;
  overflow-y: auto;
  z-index: 205;
  box-shadow: 1px 0px 6px rgba(0,0,0,0.2);
  transition: all 0.3s ease;

  h2 {
    text-transform: uppercase;
    color: $grey;
  }
}

aside.hidden-bar {
  left: -230px;
  transition: all 0.3s ease;
}

aside p a {
  font-size: 1.4em;
  color: $grey-strong;
  display: flex;
  align-items: center;
  font-weight: 300;

  svg {
    margin-right: 0.5em;
  }
}

aside section {
  margin-bottom: 2em;
}

.sidebar-title {
  margin-top: 0.5em;
  margin-bottom: 1.5em;
  text-align: center;
  font-size: 1.6em;
}

.company-logo {
  width: 200px;
  img {
    border-radius: 5px;
  }
}

#c-mask {
  position: fixed;
  z-index: 204;
  top: 0;
  left: 0;
  overflow: hidden;
  width: 0;
  height: 0;
  background-color: #000;
  opacity: 0;
}

#c-mask.is-active {
  width: 100%;
  height: 100%;
}

h2 {
  margin-top: 2em;
  margin-bottom: 0.3em;
}

.icon {
  margin-right: 8px;
}

p {
  padding-left: 0.3em;
}

p:hover {
  cursor: pointer;
  background: $white-grey;
  border-radius: 5px;
}

@media screen and (max-width: 768px) {
  .company-logo img {
    width: 40px;
    margin: 0;
    flex: 1;
  }

  .home-link {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .home-link h2 {
    margin-bottom: 0;
  }
}
</style>
