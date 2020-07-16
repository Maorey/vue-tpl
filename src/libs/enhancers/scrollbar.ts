/** hack: ElScrollbar 不出现滚动条时不显示
 */
export default <T>(component: T) => {
  const Bar = ((component as any).options || component).components.Bar
  const created = Bar.created
  if (!created || !created._) {
    Bar.created = function() {
      created && created.apply(this, arguments)
      this.$watch('size', function(this: any, size: string) {
        this.$el.style.display = size && size !== '0' ? '' : 'none'
      })
    }
    Bar.created._ = 1
  }

  return component
}
