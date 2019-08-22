<template>

        <v-text-field
            v-model="vmodel_comp"

            :label="label_comp"
            :id="id"
            :placeholder="placeholder"
            :name="name"
            :disabled="disabled"
            :readonly="readonly"
            ref="vtext"

            :type="type"
            :min="min"
            :max="max"

            :rules="vmodelRules"
            :error-messages="error_messages"
            v-mask="vmodelMask"

            :maxlength="limite"

            :autofocus="autofocus"
            :counter="counter"
            :append-icon="appendIcon"
            :loading="loading"
            :clearable="clearable"
            :hint="hint"
            :persistent-hint="persistentHint"

            :validate-on-blur="validateOnBlur"

            v-on="inputListeners"
        >
            <template slot="progress">
                <slot name="progress"></slot>
            </template>

        </v-text-field>

</template>

<script>

import {validacaoMixin} from '../jb-v-mixin-validacao'
import mask from '../jb-v-diretiva-mask'

export default {
    mixins: [validacaoMixin],
    props:{
        value:[String, Number],

        regras:String, mascara:String, limite:String,
        validarNaCriacao:Boolean,

        /** html */
        label:String, id:String, type:String, placeholder:String, name:String, disabled:Boolean, readonly:Boolean, min:Number, max:Number,

        /** vuetify */
        autofocus:Boolean,
        counter:{type:[Boolean, Number, String]},
        appendIcon:String,
        iconClickAppend:{type:Function, default:v=>(v)},
        hint:String,
        persistentHint:Boolean,
        loading:Boolean,
        validateOnBlur:Boolean,
        clearable:Boolean,

    },
    data () {return {
        vmodel: this.value,
        error_messages:null,
        validar:false,
    }},
    computed:{
        inputListeners: function () {
            /** pego da documentacao do oficial do VueJs */

            /**
             * `Object.assign` mescla objetos para formar um novo objeto
             *      -> Nós adicionamos todas as escutas do pai
             *      -> Então podemos adicionar escutas personalizadas ou substituir comportamento de algumas escutas.
             *          -> Isso garante que o componente funcione com o v-model
             */
            var vm = this

            return Object.assign({}, this.$listeners, {
                input: function (e) {
                        let value = e ? vm.pegaValorParaEmit(e) : e
                        vm.$emit('input', value)

                        // vm.$emit('input', e)
                        // vm.$emit('input', event.target.value)
                    }
                }
            )
        },
        eObrigatorio(){
            return this.$typeof(this.regras,'object') ? {}.hasOwnProperty.call(this.regras,'required') : this.regras.indexOf('required') > -1
        },
        label_comp(){
            return this.regras && this.label && this.eObrigatorio ? `${this.label} *` : this.label
        },
        vmodel_comp: {
            get(){
                return this.vmodel
            },
            set(value){
                // configurar como os valores devem ser exibidos para usuario
                // o value deve ser sempre no formato bruto (como no banco de dados)
                if(value){
                    if(this.mascara=='date' || this.mascara=='datetime' || this.mascara=='data' || this.mascara=='datahora' ){
                        value = value.split(' ')
                        value[0] = value[0].split('-').reverse().join('/')
                        value = value.join(' ')
                    }
                    else if(this.mascara == 'dinheiro' || this.mascara == 'currency'){
                        let inteiro = parseInt(value)
                        let restante = parseFloat((value - inteiro).toFixed(2))

                        value = restante ? (inteiro+restante).toFixed(2) : value*100
                    }
                    else if(this.mascara == 'percentage' || this.mascara == 'porcentagem'){
                        value = value.toString().split('.').join(',')
                    }
                }
                this.vmodel = value
            }
        },
        vmodelMask(){ return this.mascara },
        vmodelRules(){
            return this.validar ? this.executarValidacao(this.regras) : [];
        },
    },
    created(){
        this.validar = this.validarNaCriacao
    },
    watch: {
        value(v){
            this.vmodel_comp = v
        }
    },
    methods: {
        emitInput(value){
            value = this.pegaValorParaEmit(value)
            this.$emit('input', value)
        },
        pegaValorParaEmit(value){
            //configurar como os valores colocados pelo usuario devem ser guardados na variavel
            var regexDinheiro = /\d+|,(\.\d{3})*(,\d+)?/gm;
            if((this.mascara == 'dinheiro' || this.mascara == 'currency') &&  regexDinheiro.test( value )){
                value = value.match( regexDinheiro ).join([]).split('.').join('').split(',').join('.')
                value = parseFloat(value)
            }
            if((this.mascara == 'percentage' || this.mascara == 'porcentagem') &&  regexDinheiro.test( value )){
                value = value.match( regexDinheiro ).join([]).split(',').join('.')
                value = parseFloat(value)
            }
            else if(this.mascara=='date'){
                value = this.dataPtbrParaEn(value)
            }
            else if(this.mascara=='datetime'){
                value = value.split(' ')
                value[0] = this.dataPtbrParaEn(value[0])
                value = value.join(' ')
            }

            return value
        },
        dataPtbrParaEn(data){
            return data.split('/').reverse().join('-')
        }
    },


}
</script>
