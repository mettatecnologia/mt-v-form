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
            :ref="id || name"
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
        label_comp(){
            return this.regras && this.label && this.regras.indexOf('required')>-1 ? `${this.label} *` : this.label
        },
        vmodelMask(){
            return this.mascara
        },
        vmodelRules(){
            let regras = this.regras;

            if( ! regras || regras === undefined){ return }
            regras = regras.split('|');

            for(let i in regras){
                let [regra, ...params] = regras[i].trim().split(':');

                let result = null

                if(this.validacao_tipo(regra) == 'axios'){
   
                    this.loading = true
                    let Promisse = this.validacao_axios(regra, params)

                    if(Promisse instanceof Promise){
                        Promisse
                            .then( response => { 
                                this.error_messages = typeof response=='string' ? response : null 
                            })
                            .catch(error => (error))
                            .finally(v => (this.loading = false))
                    }
                    else {
                        this.loading = false
                        this.error_messages = null
                        this.result = null
                    }

                }
                else {
                    result = this.validacao_regular(regra, params)
                    if(typeof result[0]=='function' && typeof result[0](this.value) == 'string'){
                        return result
                    }
                }
                
            }
            
        },
        itens(){
            return this.items
        }
    },
}
</script>
