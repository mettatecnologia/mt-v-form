<template>

        <v-select
            v-model="vmodel"

            :label="label_comp"
            :id="id"
            :type="type"
            :placeholder="placeholder"
            :name="name"
            :disabled="disabled"
            :readonly="readonly"
            ref="vselect"
            :maxlength="limite"

            :items="itens"

            :rules="vmodelRules"
            :error-messages="error_messages"

            :append-icon="appendIcon"

            @input="value => this.$emit('input', value)"
            @change="value => this.$emit('change', value)"

        ></v-select>

</template>

<script>

import {validacaoMixin} from '../jb-v-mixin-validacao'

export default {
    mixins: [validacaoMixin],
    props:{
        value:String,

        regras:String,
        validarNaCriacao:Boolean,

        /** comuns */
        label:String, id:String, type:String, placeholder:String, name:String, disabled:Boolean, readonly:Boolean, limite:String,

        /** vuetify */
       items:Array, appendIcon:String
    },
    data () {return {
        error_messages:null
    }},
    computed:{
        vmodel(){
            return this.value
        },
        eObrigatorio(){
            return this.$typeof(this.regras,'object') ? {}.hasOwnProperty.call(this.regras,'required') : this.regras.indexOf('required') > -1
        },
        label_comp(){
            return this.regras && this.label && this.eObrigatorio ? `${this.label} *` : this.label
        },
        vmodelRules(){
            return this.validar ? this.executarValidacao(this.regras) : [];
        },
        itens(){
            return this.items
        }
    },
    created(){
        this.validar = this.validarNaCriacao
    },
}
</script>
