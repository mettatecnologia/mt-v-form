<template>
    <div>
        <slot name="mensagens">
            <jb-alerta v-model="messages" :tipo="mensagensTipo" :tooltip="mensagensDetalhes" />
        </slot>

        <v-form ref="form" :method="method" :action="action" class="pa-2" v-model="valid" @input="value => this.$emit('input', value)" @submit="submit" enctype="multipart/form-data" >
            <input v-if="csrf" type="hidden" name="_token" :value="csrf" />
                        
            <slot></slot>
            
            <slot name="botoes">
                <v-layout justify-center>
                    <v-btn type="submit" color="primary" :disabled="validar && !valid" >{{btnEnviarText}}</v-btn>
                    <v-btn @click="limpar">{{btnLimparText}}</v-btn>
                </v-layout>
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
            cancelarSubmit:Boolean,

            /** ======= BOTOES */
            btnEnviarText:{type:String, default:'Enviar'},
            btnLimparText:{type:String, default:'Limpar'},

            /** ======= MENSAGENS */
            mensagens:{type:[Array, String], default:() => ([])}, mensagensTipo:{type:String}, mensagensDetalhes:String,
        },
        data: function () {
            return {
                valid: this.value,
                mostrarAlerta: false
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
                let form = this.$refs.form;
                if(this.cancelarSubmit || (this.validar && !this.$refs.form.validate())){
                    e.preventDefault();
                }
            },
            formataMensagensDeAlerta(mensagens){  
                
                this.mostrarAlerta = false;
                
                let retorno = null

                if(mensagens && mensagens != 'null'){
                    
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

                    this.mostrarAlerta = true;
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