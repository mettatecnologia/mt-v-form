let Vue = window.Vue

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

