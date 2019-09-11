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
            :ref="vuetify_ref"

            :append-icon="senha_visivel ? 'visibility' : 'visibility_off'"

            @click:append="alternarExibicao"
            @input="v => this.$emit('input', v)"

            :key="senha_visivel"
        ></jb-text>

</template>

<script>

export default {
    props:{
        value:String,
        regras:String, label:String, id:String, type:String, placeholder:String, name:String, disabled:Boolean, readonly:Boolean, min:Number, max:Number,
    },
    data() { return {
        vmodel:this.value,
        senha_visivel:false,
    }},
    computed:{
        label_cp(){
            return this.label || 'Senha'
        },
        vuetify_ref(){
            return this.ref || 'jb-text'
        }
    },
    methods:{
        alternarExibicao(){
            this.senha_visivel = !this.senha_visivel
        },
    }
}
</script>
