// //================ Axios
import axios from 'axios'

export const validacaoMixin = {
    data() {return{
        validando: false
    }},
    computed: {
    },
    methods: {
        validacao_tipo(regra){
            return ['email-unique'].indexOf(regra)>-1 ? 'axios' : 'regular'
        },
        validacao_regular(regra, params){

            let result = null

            if(regra.indexOf('required')==0){
                result = this.__required_regra()
            }

            if(regra.indexOf('match:')==0){
                let field = params[0];
                result = this.__match_regra(field);
            }

            if(this.value){
                if(regra.indexOf('email')==0){
                    result = this.__email_regra()
                }
                if(regra.indexOf('cpf')==0){
                    result = this.__cpf_regra();
                }
                if(regra.indexOf('cnpj')==0){
                    result = this.__cnpj_regra();
                }
                if(regra.indexOf('cpf_cnpj')==0){
                    result = this.__cpf_cnpj_regra();
                }
                if(regra.indexOf('min:')==0){
                    let min = params[0];
                    result = this.__min_regra(min);
                }
                if(regra.indexOf('max:')==0){
                    let max = params[0];
                    result = this.__max_regra(max);
                }
                if(regra.indexOf('date')==0){
                    if(regra.indexOf('datetime')==0){
                        result = this.__datahora_regra();
                    }
                    else {
                        result = this.__date_regra();
                    }
                }
                if(regra.indexOf('time')==0){
                    result = this.__time_regra();
                }
                if(regra.indexOf('datahora')==0){
                    result = this.__datahora_regra();
                }
            }
            return [result]
        },
        validacao_axios(regra, params){
            if(regra.indexOf('email-unique')==0){
                let email_valido = this.$buscarRegExp('email').test(this.value)
                if( ! email_valido){ return true }
                return this.__email_unique_regra(params)
            }
        },

        /**
         * ======================
         * Regras
         * ======================
         */
        __required_regra(){
            let v = this.value
            let msg = 'Este campo é obrigatório.'
            return v => !!v || msg
        },
        __email_regra(){
            let v = this.value
            let msg = 'Digite um email válido (ex.: usuario@servidor.com).'
            return v => this.$buscarRegExp('email').test(v) || msg
        },
        __cpf_regra(){
            let v = this.value
            let msg = 'Digite um CPF válido (ex.: 000.000.000-00).'
            return v => this.$buscarRegExp('cpf').test(v) || msg
        },
        __cnpj_regra(){
            let v = this.value
            let msg = 'Digite um CNPJ válido (ex.: 00.000.000/0000-00).'
            return v => this.$buscarRegExp('cnpj').test(v) || msg
        },
        __cpf_cnpj_regra(){
            var numbers = this.value ? this.value.match(/\d+/g).join('') : 0;
            if(this.value && numbers.length>11){
                return this.__cnpj_regra()
            }
            else {
                return this.__cpf_regra()
            }
        },
        __date_regra(){
            let v = this.value
            let msg = 'Digite uma data válida'
            return v => this.$buscarRegExp('date_ptbr').test(v) || msg
        },
        __time_regra(){
            let v = this.value
            let msg = 'Digite um tempo válido'
            return v => this.$buscarRegExp('time').test(v) || msg
        },
        __datahora_regra(){
            let datahora = this.value

            let msg = null

            if(datahora){
                let parts = datahora.split(' ')

                let date_validate = this.$buscarRegExp('date_ptbr').test(parts[0])
                let time_validate = this.$buscarRegExp('time').test(parts[1])

                if( ! date_validate){
                    msg = 'Digite uma data válida'
                }
                else if( ! time_validate){
                    msg = 'Digite uma hora válida'
                }
            }

            return msg || true;
        },
        __min_regra(min){
            let ecurrency = this.regras.split('|').indexOf('currency')>-1
            let mascara = this.mascara

            if(this.type=='number' || ecurrency || mascara=='integer'){
                let v = this.value
                let msg = 'No mínimo '+min
                return v => (v && parseFloat(v) >= parseFloat(min)) || msg
            }
            else {
                let v = this.value
                let msg = 'No mínimo '+min+' caracteres'
                return v => (v && v.length >= min) || msg
            }
        },
        __max_regra(max){
            let ecurrency = this.regras.split('|').indexOf('currency')>-1
            let mascara = this.mascara

            if(this.type=='number' || ecurrency || mascara=='percentage' || mascara=='integer'){
                let v = this.value
                let msg = 'No máximo '+max
                return v => (v && parseFloat(v) <= parseFloat(max)) || msg
            }
            else {
                let v = this.value
                let msg = 'No máximo '+max+' caracteres'
                return v => (v && (!!max || v.length <= max)) || msg
            }
        },
        __match_regra(field){
            let inputs = document.getElementsByTagName('input')

            let input = inputs.namedItem(field)
            if(input){
                if(input.value){
                    let input_label = input.getAttribute('aria-label')

                    let msg = 'O valor deve ser igual'
                    let v = this.value
                    msg +=  input_label ? ' ao do campo ['+input_label+']':'.'
                    return v => (!!v && v) == input.value || msg
                }
            }
            else {
                console.log(`campo '${field}' não encontrado, verique se o mesmo possui a campo 'name' com este nome.`);
            }

            return true
        },

        __email_unique_regra(params){
            let url = 'verificar-email'
            let ignore_id = null

            for(let i in params){
                let param = params[i]
                let [nome, valor] = param.split('=')
                switch (nome) {
                    case 'url':
                        url = valor
                        break;
                    case 'ignore_id':
                        ignore_id = valor
                        break;
                }
            }

            let email = this.value

            if(url=='local'){ /** nada ainda */}
            else {
                url = '/'+url+'/'+email
                if(ignore_id){
                    url += '/'+ignore_id
                }

                let promisse = axios
                    .get(url)
                    .then(v => {
                        let response = v.data.__response
                        if( ! response.erro){
                            let dados = response.dados
                            if(dados.existe){
                                return 'Este email já está cadastrado, tente outro.'
                            }
                            else {
                                return true
                            }
                        }
                    })

                return promisse
            }
        },




    },
  }
