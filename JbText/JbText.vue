<template>

        <v-text-field
            v-model="vmodel_comp"

            :label="label_comp"
            :id="id"
            :placeholder="placeholder"
            :name="name"
            :disabled="disabled"
            :readonly="readonly"
            :ref="id || name || 'jbvtext'"

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
        error_messages:null
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
                        let value = vm.pegaValorParaEmit(e)
                        vm.$emit('input', value)

                        // vm.$emit('input', e)
                        // vm.$emit('input', event.target.value)
                    }
                }
            )
        },
        label_comp(){
            return this.regras && this.label && this.regras.indexOf('required')>-1 ? `${this.label} *` : this.label
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
    },
    created(){
    },
    mounted(){
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
