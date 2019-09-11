<template>

        <v-textarea
            v-model="vmodel"

            :label="label_comp"
            :rules="vmodelRules"
            :error-messages="error_messages"
            :name="name"

            :ref="vuetify_ref"
        ></v-textarea>

</template>

<script>

import {validacaoMixin} from './mixins/jb-v-mixin-validacao'
import {inputBaseMixin} from './mixins/jb-v-mixin-input-base'

export default {
    extends: window.Vue._VTextarea,
    mixins: [validacaoMixin, inputBaseMixin],
    computed:{
        vuetify_ref(){
            return this.ref || 'v-textarea'
        }
    },
    methods:{
        iconClickAppendFunction(){
            return this.iconClickAppend()
        },
    },
}
</script>
