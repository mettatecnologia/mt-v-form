<template>

        <v-combobox
            v-model="vmodel"

            :label="label_comp"
            :id="id"
            :type="type"
            :placeholder="placeholder"
            :name="name"
            :disabled="disabled"
            :readonly="readonly"
            ref="vcombobox"
            :maxlength="limite"

            :items="itens"
            :append-icon="appendIcon"
            :rules="vmodelRules"
            :error-messages="error_messages"
            v-mask="vmodelMask"
            :search-input.sync="search"

            @input="v => this.$emit('input', v)"
            @change="v => this.$emit('change', v)"

        >
            <template v-slot:no-data>
                <v-list-tile>
                    <v-list-tile-content>
                    <v-list-tile-title>
                        Nenhum resultado para "<strong>{{ search }}</strong>".
                    </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </template>
        </v-combobox>

</template>

<script>

import {validacaoMixin} from '../jb-v-mixin-validacao'

export default {
    mixins: [validacaoMixin],
    props:{
        value:Object,

        regras:String, mascara:String,
        validarNaCriacao:Boolean,

        /** comuns */
        label:String, id:String, type:String, placeholder:String, name:String, disabled:Boolean, readonly:Boolean, limite:String,

        /** vuetify */
       items:Array, appendIcon:String
    },
    data() {return{
        search:'',
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
        vmodelMask(){
            return this.mascara
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
