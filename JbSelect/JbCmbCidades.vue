<template>
<div>
    <!-- o codigo -->

    <jb-loading v-model="loading.mostrar"></jb-loading>
    <jb-combobox v-model="cidade" :items="cidades" :name="name" :label="label" @input="input" :regras="regras" :disabled="disabled" ref="jbcombobox" :id="id"></jb-combobox>
</div>

</template>

<script>

import axios from 'axios'

export default {
    props:{
        value:String,
        uf:String,
        regras:String,
        name:String,
        label:String,
        disabled:Boolean,
        id:String,
    },
    data: function () { return {
        cidade: null,
        cidades:[],
        loading:{
            mostrar:false
        },
    }},
    computed:{
        cidade_cod(){
            return this.value
        },
    },
    created(){
        if(this.uf){
            this.buscarCidades(this.uf)
        }
    },
    watch:{
        'uf'(uf){
            this.cidade = null
            this.buscarCidades(uf)
        },
    },
    methods:{
        input(v){
            this.$emit('input', v.value)
        },
        buscarCidades(uf){
            this.loading.mostrar = true

            axios.get(`buscarCidadesPorEstado/${uf}`)
            .then(v => {
                let response = v.data.__response

                if(response.erro){
                    this.dialog.form.mensagensTipo_data = response.mensagens_tipo
                    this.dialog.form.mensagens_data = response.mensagens
                }
                else {
                    this.cidades = response.dados.length ? this.$criarObjetoParaCombobox(response.dados, 'cidade_nome', 'cidade_cod') : [];
                    if(this.cidade_cod){
                        this.selecionarCidade()
                    }
                }
            })
            .finally(v => (this.loading.mostrar = false))
        },
        selecionarCidade(){
            let result = this.$buscaItemDatatable(this.cidades, this.cidade_cod)
            if(result.index < 0){
                return null
            }
            else {
                this.cidade = result.result;
            }
        },
    },
}
</script>
