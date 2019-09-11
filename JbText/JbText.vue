<template>

    <v-text-field
        :label="label_comp"
        :error-messages="error_messages"
        :rules="vmodelRules"

        :name="name"

        v-model="vmodel_comp"
        v-mask="vmodelMask"
        v-on="inputListeners"

        :ref="vuetify_ref"
    >

    </v-text-field>

</template>

<script>

import {validacaoMixin} from '../mixins/jb-v-mixin-validacao'
import {inputBaseMixin} from '../mixins/jb-v-mixin-input-base'
import mask from '../jb-v-diretiva-mask'

export default {
    extends: window.Vue._VTextField,
    mixins: [validacaoMixin, inputBaseMixin],
    data () {return {
        vmodel: this.value,
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
        vuetify_ref(){
            return this.ref || 'v-text-field'
        },
    },
    updated(){
        let v_textfield = this.$refs[this.vuetify_ref]
        v_textfield._props.type = this._props.type
        v_textfield._props.appendIcon = this._props.appendIcon
        v_textfield._props.value = this._props.value
    },
    methods: {
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
        },
    },


}
</script>
