<template>

        <jb-text
            v-model="vmodel"
            :name="name"
            :label="label"
            :regras="regras"
            :type="senha_visivel ? 'text' : 'password'"

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
