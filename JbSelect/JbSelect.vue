<template>

        <v-select
            v-model="vmodel"

            :label="label_comp"
            :rules="vmodelRules"
            :error-messages="error_messages"
            :name="name"

            :ref="vuetify_ref"

        ></v-select>

</template>

<script>

import {validacaoMixin} from '../mixins/jb-v-mixin-validacao'
import {inputBaseMixin} from '../mixins/jb-v-mixin-input-base'

export default {
    extends: window.Vue._VSelect,
    mixins: [validacaoMixin, inputBaseMixin],
    computed:{
        itens(){
            return this.items
        },
        vuetify_ref(){
            return this.ref || 'v-select'
        }
    },
}
</script>
