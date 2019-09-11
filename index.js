let Vue = window.Vue

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
Vue['_VForm'] = _interopRequireDefault(require("vuetify/lib/components/VForm/VForm")).default;
Vue['_VTextField'] = _interopRequireDefault(require("vuetify/lib/components/VTextField/VTextField")).default;
Vue['_VSelect'] = _interopRequireDefault(require("vuetify/lib/components/VSelect/VSelect")).default;
Vue['_VCombobox'] = _interopRequireDefault(require("vuetify/lib/components/VCombobox/VCombobox")).default;
Vue['_VTextarea'] = _interopRequireDefault(require("vuetify/lib/components/VTextarea/VTextarea")).default;

Vue.component('jb-form', require('./JbForm.vue').default);
Vue.component('jb-textarea', require('./JbTextarea.vue').default);

Vue.component('jb-select', require('./JbSelect/JbSelect.vue').default);
Vue.component('jb-combobox', require('./JbSelect/JbCombobox.vue').default);
Vue.component('jb-cmb-logradourotipo', require('./JbSelect/JbCmbLogradouroTipo.vue').default);
Vue.component('jb-cmb-uf', require('./JbSelect/JbCmbUF.vue').default);
Vue.component('jb-cmb-cidades', require('./JbSelect/JbCmbCidades.vue').default);

Vue.component('jb-text', require('./JbText/JbText.vue').default);
Vue.component('jb-text-password', require('./JbText/JbTextPassword.vue').default);
Vue.component('jb-text-datetime', require('./JbText/JbTextDateTime.vue').default);
Vue.component('jb-text-email', require('./JbText/JbTextEmail.vue').default);

