<template>
    <div>
        <slot name="mensagens">
            <jb-alert v-model="messages" :tipo="mensagensTipo" :tooltip="mensagensDetalhes" />
        </slot>

        <v-form ref="form" :method="method" :action="action" class="pa-2" v-model="valid" @input="value => this.$emit('input', value)" @submit="submit" enctype="multipart/form-data" >
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
        props: {
            value:Boolean,
            /** ======= FORMULARIO */
            method:{type:String, default:"POST"}, action:String,
            csrf:String,
            validar:Boolean,
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
            }
        },
        methods: {
            limpar(){
                this.$refs.form.reset();
            },
            submit(e) {
                this.$emit('submit', e, this.$refs.form.validate());

                let form = this.$refs.form;
                let tem_action = !!this.action

                if( ! tem_action || this.cancelarActionSubmit || (this.validar && !this.$refs.form.validate())){
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
        },
        mounted(){
        },
        updated(){
            if(this.resetValidation){
                this.$refs.form.resetValidation();
            }
        },
    }
 </script>
