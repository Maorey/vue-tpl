/** hack: 使ElUpload支持 props onFileChange 文件变化
 */
export default <T>(component: T) => {
  let options = (component as any).options || component
  // hack props
  if ((options.props || (options.props = {})).onFileChange) {
    return
  }

  options.props.onFileChange = Function // add prop
  // fix clearFiles
  ;(options.methods || (options.methods = {})).clearFiles = function() {
    const uploadFiles = this.uploadFiles
    for (const file of uploadFiles) {
      this.handleRemove(file, file.raw)
    }
    this.uploadFiles = []
  }
  // find upload component
  if (!(options = options.components?.Upload)) {
    return
  }

  options.options && (options = options.options)
  const handleChange = (options.methods || (options.methods = {})).handleChange
  options.methods.handleChange = function(event: Event) {
    const vm = this.$parent
    vm.onFileChange && vm.onFileChange(event, vm)
    handleChange.apply(this, arguments)
  }

  return component
}
