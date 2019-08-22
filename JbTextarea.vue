<template>

        <v-textarea
            v-model="vmodel"

            :label="label_comp"
            :id="id"
            :type="type"
            :placeholder="placeholder"
            :name="name"
            :disabled="disabled"
            :rows="rows"
            :readonly="readonly"
            ref="vtextarea"

            :rules="vmodelRules"
            :maxlength="limite"

            :counter="counter"
            :append-icon="appendIcon"
            :filled="filled"

            @click:append="iconClickAppendFunction"

            @input="value => this.$emit('input', value)"
        ></v-textarea>

</template>

<script>

import {validacaoMixin} from './jb-v-mixin-validacao'

export default {
    mixins: [validacaoMixin],
    props:{
        value:String,

        regras:String, limite:String,
        validarNaCriacao:Boolean,

        /** comuns */
        label:String, id:String, type:String, placeholder:String, name:String, disabled:Boolean, readonly:Boolean, rows:Number,

        /** vuetify */
        counter:{type:[Boolean, Number, String]}, appendIcon:String, iconClickAppend:Function, filled:Boolean
    },
    data: function () {
        return {
            vmodel:this.value,
            validar:false,
        }
    },
    computed:{
        label_comp(){
            return this.regras && this.regras.indexOf('required')>-1 ? `${this.label} *` : this.label
        },
        vmodelRules(){
            return this.validar ? this.executarValidacao(this.regras) : [];
        },
    },
    created(){
        this.validar = this.validarNaCriacao
    },
    watch: {
        value: function (newValue, oldValue) {
            this.vmodel = newValue
        }
    },
    methods: {
        iconClickAppendFunction(){
            return this.iconClickAppend()
        }
    },
}
</script>
