/** hack: ElFormItem for 表单(ElForm)重设初始值(initialValue)
 */
export default <T>(component: T) => {
  const options = (component as any).options || component

  if (!options.mounted || !options.mounted._) {
    options.mounted = function() {
      if (this.prop) {
        this.dispatch('ElForm', 'el.form.addField', [this])
        Array.isArray((this.initialValue = this.fieldValue)) &&
          (this.initialValue = [this.initialValue])
        this.addValidateEvents()
      }
    }
    options.methods.setIni = function(model: IObject) {
      for (const field of this.fields) {
        field.initialValue = model[field.prop]
      }
      this.clearValidate()
    }
    options.mounted._ = 1
  }

  return component
}
