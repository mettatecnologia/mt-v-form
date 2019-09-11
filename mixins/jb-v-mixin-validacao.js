import axios from 'axios'

export const validacaoMixin = {
    data() {return{
        validando: false,
    }},
    computed: {
    },
    mounted(){
    },
    methods: {
        executarValidacao(regras){

            if(this.$typeof(regras,'string'))
            {
                regras = [regras]
            }

            for(let i in regras){
                let result = null

                let regra = null
                let params = null

                if(this.$typeof(regras,'object'))
                {
                    params = regras[i]
                    regra = i
                }
                else
                {
                    regra = regras[i]

                    if(this.$typeof(regra,'object')){
                        result = this.executarValidacao(regra)
                        if(result){
                            return result
                        }
                    }
                }

                if(this.validacao_tipo(regra) == 'axios')
                {
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
                else
                {
                    this.error_messages = null
                    result = this.validacao_regular(regra, params)

                    if(typeof result[0]=='function' && typeof result[0](this.value) == 'string'){
                        return result
                    }
                }

            }

        },
        validacao_tipo(regra){
            return ['email-unique'].indexOf(regra)>-1 ? 'axios' : 'regular'
        },
        validacao_regular(regra, params){

            let result = null

            if(regra == 'required'){
                result = this.__required_regra(params)
            }

            if(regra == 'match'){
                result = this.__match_regra(params);
            }

            if(this.value){

                if(regra == 'email'){
                    result = this.__email_regra()
                }
                if(regra == 'cpf'){
                    result = this.__cpf_regra();
                }
                if(regra == 'cnpj'){
                    result = this.__cnpj_regra();
                }
                if(regra == 'cpf_cnpj'){
                    result = this.__cpf_cnpj_regra();
                }
                if(regra == 'min'){
                    let min = params;
                    result = this.__min_regra(min);
                }
                if(regra == 'max'){
                    let max = params;
                    result = this.__max_regra(max);
                }
                if(regra == 'date'){
                    if(regra == 'datetime'){
                        result = this.__datahora_regra();
                    }
                    else {
                        result = this.__date_regra();
                    }
                }
                if(regra == 'time'){
                    result = this.__time_regra();
                }
                if(regra == 'datahora'){
                    result = this.__datahora_regra();
                }
            }

            return [result]
        },
        validacao_axios(regra, params){
            if(regra == 'email-unique'){
                let email_valido = this.$buscarRegExp('email').test(this.value)
                if( ! email_valido){ return true }
                return this.__email_unique_regra(params)
            }
        },
        getFormComponent(VueComponent){

            let VueComp = VueComponent ? VueComponent : this
            VueComp = VueComp.$parent
            if(VueComp._vnode.tag == 'form')
            {
                return VueComp
            }
            else if(VueComp.$parent) {
                VueComp = this.getFormComponent(VueComp)
            }
            else {
                VueComp = false
            }

            return VueComp;
        },
        getFormInputsComponents(VueComponent, FormComponent){
            if( ! FormComponent)
            {
                FormComponent = this.getFormComponent(VueComponent)
            }
            return FormComponent ? FormComponent.inputs : null
        },
        getFormInputComponent(idOuName, inputs){
            if( ! inputs || !this.$typeof(inputs,'array'))
            {
                inputs = this.getFormInputsComponents(this)
            }

            for (const i in inputs) {
                const Input = inputs[i];

                let input = Input._props

                if(input.id == idOuName || input.name == idOuName )
                {
                    return Input
                }
            }

            return false;

        },

        /**
         * ======================
         * Regras acumulativas
         * ======================
         */
        __required_regra(subregras){
            let v = this.value
            let msg = ''
            let result = true

            if(subregras && Object.keys(subregras).length)
            {
                for (const subregra in subregras) {
                    let campos = subregras[subregra];
                    campos = this.$typeof(campos,'string') ? [campos] : campos
                    let campos_nomes_exibicao = []
                    switch (subregra) {
                        case 'or': {
                            let values = [v]
                            for (const i in campos) {
                                const Input = this.getFormInputComponent(campos[i]);
                                const input = Input ? Input._props : null
                                if(input)
                                {
                                    campos_nomes_exibicao.push(Input.$parent.label || Input.$parent.id || Input.$parent.name)
                                    values.push(Input.value)
                                }
                            }
                            let array_sem_valores_null = values.filter(Boolean)

                            msg = 'Pelo menos um desses campos é obrigatório: ' + [this.label || this.id || this.name].concat(campos_nomes_exibicao).join(', ')
                            result = () => array_sem_valores_null.length > 0 || msg

                            break;
                        }

                        default:
                            break;
                    }

                }
            }
            else
            {
                msg = 'Este campo é obrigatório.'
                result = v => !!v || msg

            }

            return result
        },
        __min_regra(min){
            let regras = this.regras || this.rules
            let ecurrency = {}.hasOwnProperty.call(regras,'currency')
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
            let regras = this.regras || this.rules
            if(!max || max<1){
                return true
            }
            let ecurrency = {}.hasOwnProperty.call(regras,'currency')
            let mascara = this.mascara

            if(this.type=='number' || ecurrency || mascara=='percentage' || mascara=='integer'){
                let v = this.value
                let msg = 'No máximo '+max
                return v => (v && parseFloat(v) <= parseFloat(max)) || msg
            }
            else {
                let v = this.value
                let msg = 'No máximo '+max+' caracteres'
                return v => (v && v.length <= max) || msg
            }
        },
        __match_regra(campos){

            let v = this.value
            let values = []
            let campos_nomes_exibicao = []
            if(this.$typeof(campos,'string')){
                campos = [campos]
            }

            for (const i in campos) {
                const Input = this.getFormInputComponent(campos[i]);
                const input = Input ? Input._props : null
                if(input)
                {
                    let this_value = this.value ? this.value.trim() : ''
                    let input_value = Input.value ? Input.value.trim() :  ''

                    campos_nomes_exibicao.push(Input.$parent.label || Input.$parent.id || Input.$parent.name)
                    if( this_value == input_value ){
                        values.push(input_value)
                    }

                }
            }

            let msg = 'Os seguinte campos precisam ser iguais: ' + [this.label || this.id || this.name].concat(campos_nomes_exibicao).join(', ')

            return () => values.length == campos.length || msg
        },

        /**
         * ======================
         * Regras não acumulativas
         * ======================
         */
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

            var numbers = this.value && this.value.match(/\d+/g) ? this.value.match(/\d+/g).join('') : 0;
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

            return v => msg
        },
        __email_unique_regra(subregras){

            let url = 'verificar-email'
            let ignore_id = null

            for(let subregra in subregras){
                let valor = subregras[subregra]

                switch (subregra) {
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
