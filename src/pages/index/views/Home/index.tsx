/*
 * @Description: Home 视图
 * @Author: 毛瑞
 * @Date: 2019-07-09 16:08:07
 */
// import { on } from '@/utils/eventBus' // 全局消息总线
import { getAsync } from '@/utils/highOrder' // 高阶组件工具

import PageHeader from '@indexCom/PageHeader' // 页面标题
import ModuleContainer from '@indexCom/ModuleContainer' // 模块容器

import $style from './index.module.scss'

// 异步组件
const ModuleOne: any = getAsync(() =>
  import(/* webpackChunkName: "ihOne" */ './ModuleOne')
)
const ModuleTwo: any = getAsync(() =>
  import(/* webpackChunkName: "ihTwo" */ './ModuleTwo')
)
const ModuleThree: any = getAsync(() =>
  import(/* webpackChunkName: "ihThree" */ './ModuleThree')
)
const ModuleFour: any = getAsync(() =>
  import(/* webpackChunkName: "ihFour" */ './ModuleFour')
)
const ModuleFive: any = getAsync(() =>
  import(/* webpackChunkName: "ihFive" */ './ModuleFive')
)
const ModuleSix: any = getAsync(() =>
  import(/* webpackChunkName: "ihSix" */ './ModuleSix')
)

// functional
export default () => (
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
