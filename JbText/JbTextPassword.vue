<template>

        <jb-text
            v-model="vmodel"
            :name="name"
            :label="label_cp"
            :regras="regras"
            :type="senha_visivel ? 'text' : 'password'"

            :id="id"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            ref="jbtext"

            :append-icon="senha_visivel ? 'visibility' : 'visibility_off'"

            @click:append="alternarExibicao"
            @input="value => this.$emit('input', value)"
        ></jb-text>

</template>

<script>

export default {
    props:{
        value:String,
        regras:String, label:String, id:String, type:String, placeholder:String, name:String, disabled:Boolean, readonly:Boolean, min:Number, max:Number,
    },
    data: function () {
        return {
        }
    },
    computed:{
        vmodel(){
            return this.value
        },
        label_cp(){
            return this.label || 'Senha'
        }
    },
    methods:{
        alternarExibicao(){
            this.senha_visivel = !this.senha_visivel
            //reenvia o valor para forçar a atualiação do campo e trocar o icone
            let valor = this.value
            this.value = ''
            this.value = valor
        },
    }
}
</script>
