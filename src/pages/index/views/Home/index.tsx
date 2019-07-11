/*
 * @Description: Home 页
 * @Author: 毛瑞
 * @Date: 2019-07-09 16:08:07
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-11 15:38:48
 */
import { eventBus } from '@/utils/eventBus' // 全局消息总线
import { getAsync } from '@/utils/highOrder' // 高阶组件工具

import PageHeader from '@indexCom/PageHeader.vue' // 页面标题
import ModuleContainer from '@indexCom/ModuleContainer.vue' // 模块容器

import { Component, Vue } from 'vue-property-decorator'

import $style from './index.module.scss'

// 异步组件
const ModuleOne = getAsync(() =>
  import(/* webpackChunkName: "ihOne" */ './ModuleOne.vue')
) as any
const ModuleTwo = getAsync(() =>
  import(/* webpackChunkName: "ihTwo" */ './ModuleTwo.vue')
) as any
const ModuleThree = getAsync(() =>
  import(/* webpackChunkName: "ihThree" */ './ModuleThree.vue')
) as any
const ModuleFour = getAsync(() =>
  import(/* webpackChunkName: "ihFour" */ './ModuleFour.vue')
) as any
const ModuleFive = getAsync(() =>
  import(/* webpackChunkName: "ihFive" */ './ModuleFive.vue')
) as any
const ModuleSix = getAsync(() =>
  import(/* webpackChunkName: "ihSix" */ './ModuleSix.vue')
) as any

@Component
export default class extends Vue {
  private render() {
    return (
      <div class={$style.wrapper}>
        {/* 标题 */}
        <PageHeader />
        {/* 内容 */}
        <div class={$style.content}>
          {/* 模块一 */}
          <ModuleContainer class={$style.one}>
            <template slot='icon'>
              <i class='i-check-circle' />
            </template>
            <template slot='title'>模块一</template>
            <template slot='unit'>单位: GB</template>

            <ModuleOne />
          </ModuleContainer>
          {/* 模块二 */}
          <ModuleContainer class={$style.two}>
            <template slot='icon'>
              <i class='i-CI' />
            </template>
            <template slot='title'>模块二</template>
            <template slot='unit'>单位: %</template>

            <ModuleTwo />
          </ModuleContainer>
          {/* 模块三 */}
          <ModuleContainer class={$style.three}>
            <template slot='icon'>
              <i class='i-Dollar' />
            </template>
            <template slot='title'>模块三</template>
            <template slot='unit'>单位: 件</template>

            <ModuleThree />
          </ModuleContainer>
          {/* 模块四 */}
          <ModuleContainer class={$style.four}>
            <template slot='icon'>
              <i class='i-compass' />
            </template>
            <template slot='title'>模块四</template>
            <template slot='unit'>单位: 个</template>

            <ModuleFour />
          </ModuleContainer>
          {/* 模块五 */}
          <ModuleContainer class={$style.five}>
            <template slot='icon'>
              <i class='i-close-circle' />
            </template>
            <template slot='title'>模块五</template>
            <template slot='unit'>单位: 条</template>

            <ModuleFive />
          </ModuleContainer>
          {/* 模块六 */}
          <ModuleContainer class={$style.six}>
            <template slot='icon'>
              <i class='i-frown' />
            </template>
            <template slot='title'>模块六</template>
            <template slot='unit'>单位: 人</template>

            <ModuleSix />
          </ModuleContainer>
        </div>
      </div>
    )
  }
}
