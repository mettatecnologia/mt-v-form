
export const inputBaseMixin = {
    props:{
        name:String,
        validarNaCriacao:Boolean,
        mascara:String,
        regras:String
    },
    data() {return{
        error_messages:null,
        validar:false,
        regras_validacao:null,
    }},
    computed: {
        vmodel(){
            return this.value
        },
        eObrigatorio(){
            return this.$typeof(this.regras_validacao,'object') ? {}.hasOwnProperty.call(this.regras_validacao,'required') : this.regras_validacao.indexOf('required') > -1
        },
        label_comp(){
            return this.regras_validacao && this.label && this.eObrigatorio ? `${this.label} *` : this.label
        },
        vmodelRules(){
            let result = this.validar ? this.executarValidacao(this.regras_validacao) : [];
            return result
        },
        vmodelMask(){
            return this.mascara
        },
    },
    created(){

        this.validar = this.validarNaCriacao
        this.regras_validacao = this.regras || this.rules
        this.rules = []

    },
    mounted(){
        this.$mesclarComponentesViaRef(this)
    },
  }
