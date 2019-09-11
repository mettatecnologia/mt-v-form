<template>
    <div>
        <slot name="mensagens">
            <jb-alert v-model="messages" :color="mensagensTipo" :tooltip="mensagensDetalhes" dense />
        </slot>

        <v-form :ref="vuetify_ref" :method="method" :action="action" class="pa-2" v-model="valid" @input="v => this.$emit('input', v)" @submit="submit" enctype="multipart/form-data" >
            <input v-if="csrf" type="hidden" name="_token" :value="csrf" />

            <slot></slot>

            <slot name="botoes">
                <v-row justify="center">
                    <v-btn type="submit" color="primary" :disabled="validar && !valid" class="mr-1" >{{btnEnviarText}}</v-btn>
                    <v-btn @click="limpar" class="ml-1">{{btnLimparText}}</v-btn>
                </v-row>
            </slot>
        </v-form>

    </div>
</template>

<script>
    export default {
        extends: window.Vue._VForm,
        props: {
            value:Boolean,
            /** ======= FORMULARIO */
            method:{type:String, default:"POST"}, action:String,
            csrf:String,
            validar:Boolean,
            validarCampos:{type:Boolean, default:true},
            resetValidation:Boolean,
            cancelarActionSubmit:{type:Boolean},

            /** ======= BOTOES */
            btnEnviarText:{type:String, default:'Enviar'},
            btnLimparText:{type:String, default:'Limpar'},

            /** ======= MENSAGENS */
            mensagens:{type:[Array, String], default:() => ([])}, mensagensTipo:{type:String}, mensagensDetalhes:String,
        },
        data: function () {
            return {
                valid: this.value,
            }
        },
        computed: {
            messages: function () {
                return this.formataMensagensDeAlerta(this.mensagens)
            },
            vuetify_ref(){
                return this.ref || 'v-form'
            }
        },
        mounted(){
            this.$mesclarComponentesViaRef(this,'_events')

            if(this.validarCampos)
            {
                this.ativarValidacaoCampos()
            }
        },
        watch:{
            resetValidation(v){
                if(v)
                {
                    this.$refs[this.vuetify_ref].resetValidation();
                }
            }
        },
        methods: {
            limpar(){
                this.$refs[this.vuetify_ref].reset();
            },
            submit(e) {
                this.$emit('submit', e, this.$refs[this.vuetify_ref].validate());

                let form = this.$refs[this.vuetify_ref];
                let tem_action = !!this.action

                if( ! tem_action || this.cancelarActionSubmit || (this.validar && !this.$refs[this.vuetify_ref].validate())){
                    e.preventDefault();
                }
            },
            formataMensagensDeAlerta(mensagens){

                let retorno = null

                if(typeof mensagens=='string' && /[a-z0-9]/i.test(mensagens)){

                    if(this.$isJson(mensagens)){
                        retorno = JSON.parse(mensagens)
                    }
                    else if(typeof mensagens=='object' && Object.keys(mensagens).length){
                        retorno = mensagens
                    }
                    else if(typeof mensagens=='string' && /[a-z0-9]/i.test(mensagens)){
                        retorno = {0: mensagens}
                    }
                    else {
                        return ;
                    }

                    return retorno;

                }
            },
            ativarValidacaoCampos(){
                let inputs = this.$refs[this.vuetify_ref].inputs
                for (const i in inputs) {
                    const input = inputs[i];
                    input.$parent.validar = true
                }
            },
        },
    }
 </script>
