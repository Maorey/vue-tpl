/*
 * @Description: Home 视图
 * @Author: 毛瑞
 * @Date: 2019-07-09 16:08:07
 */
import { on } from '@/utils/eventBus' // 全局消息总线
import { getAsync } from '@/utils/highOrder' // 高阶组件工具

import PageHeader from '@indexCom/PageHeader' // 页面标题
import ModuleContainer from '@indexCom/ModuleContainer' // 模块容器

import { CreateElement } from 'vue'
import { Component, Vue } from 'vue-property-decorator'

import $style from './index.module.scss'

// 异步组件
/* eslint-disable comma-dangle */
const ModuleOne = getAsync(() =>
  import(/* webpackChunkName: "ihOne" */ './ModuleOne'),
) as any
const ModuleTwo = getAsync(() =>
  import(/* webpackChunkName: "ihTwo" */ './ModuleTwo'),
) as any
const ModuleThree = getAsync(() =>
  import(/* webpackChunkName: "ihThree" */ './ModuleThree'),
) as any
const ModuleFour = getAsync(() =>
  import(/* webpackChunkName: "ihFour" */ './ModuleFour'),
) as any
const ModuleFive = getAsync(() =>
  import(/* webpackChunkName: "ihFive" */ './ModuleFive'),
) as any
const ModuleSix = getAsync(() =>
  import(/* webpackChunkName: "ihSix" */ './ModuleSix'),
) as any

@Component
export default class extends Vue {
  private render(h: CreateElement) {
    return (
      <div class={$style.wrapper}>
        {/* 标题 */}
        <PageHeader />
        {/* 内容 */}
        <div class={$style.content}>
          <ModuleContainer class={$style.one}>
            <template slot="icon">
              <i class="i-check-circle" />
            </template>
            <template slot="title">ECharts</template>

            <ModuleOne />
          </ModuleContainer>

          <ModuleContainer class={$style.two}>
            <template slot="icon">
              <i class="i-CI" />
            </template>
            <template slot="title">ECharts + ZRender</template>

            <ModuleTwo />
          </ModuleContainer>

          <ModuleContainer class={$style.three}>
            <template slot="icon">
              <i class="i-Dollar" />
            </template>
            <template slot="title">three.js</template>

            <ModuleThree />
          </ModuleContainer>

          <ModuleContainer class={$style.four}>
            <template slot="icon">
              <i class="i-compass" />
            </template>
            <template slot="title">luma.gl</template>

            <ModuleFour />
          </ModuleContainer>

          <ModuleContainer class={$style.five}>
            <template slot="icon">
              <i class="i-close-circle" />
            </template>
            <template slot="title">d3</template>

            <ModuleFive />
          </ModuleContainer>

          <ModuleContainer class={$style.six}>
            <template slot="icon">
              <i class="i-frown" />
            </template>
            <template slot="title">zdog + pixi.js(背景)</template>

            <ModuleSix />
          </ModuleContainer>
        </div>
      </div>
    )
  }
}
