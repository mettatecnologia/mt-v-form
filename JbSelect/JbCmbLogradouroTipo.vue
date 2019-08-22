<template>

        <jb-combobox v-model="vmodel" :items="tipos" :name="name" :label="label" @input="v => this.$emit('input', v.value)" :regras="regras" ref="jbcombobox" :id="id"> </jb-combobox>

</template>

<script>

export default {
    props:{
        value:String,
        regras:String,
        name:String,
        label:String,
        id:String,
    },
    data: function () { return {
        tipos:[

            {text:'Avenida', value:'Avenida'},
            {text:'Praça', value:'Praça'},
            {text:'Rua', value:'Rua'},
            {text:'Travessa', value:'Travessa'},
            {text:'Vila', value:'Vila'},

            {text:' # Outros # ', value:null},

            {text:'Aeroporto', value:'Aeroporto'},
            {text:'Alameda', value:'Alameda'},
            {text:'Área', value:'Área'},
            {text:'Campo', value:'Campo'},
            {text:'Chácara', value:'Chácara'},
            {text:'Colônia', value:'Colônia'},
            {text:'Condomínio', value:'Condomínio'},
            {text:'Conjunto', value:'Conjunto'},
            {text:'Distrito', value:'Distrito'},
            {text:'Esplanada', value:'Esplanada'},
            {text:'Estação', value:'Estação'},
            {text:'Estrada', value:'Estrada'},
            {text:'Favela', value:'Favela'},
            {text:'Fazenda', value:'Fazenda'},
            {text:'Feira', value:'Feira'},
            {text:'Jardim', value:'Jardim'},
            {text:'Ladeira', value:'Ladeira'},
            {text:'Lago', value:'Lago'},
            {text:'Lagoa', value:'Lagoa'},
            {text:'Largo', value:'Largo'},
            {text:'Loteamento', value:'Loteamento'},
            {text:'Morro', value:'Morro'},
            {text:'Núcleo', value:'Núcleo'},
            {text:'Parque', value:'Parque'},
            {text:'Passarela', value:'Passarela'},
            {text:'Pátio', value:'Pátio'},
            {text:'Quadra', value:'Quadra'},
            {text:'Recanto', value:'Recanto'},
            {text:'Residencial', value:'Residencial'},
            {text:'Rodovia', value:'Rodovia'},
            {text:'Setor', value:'Setor'},
            {text:'Sítio', value:'Sítio'},
            {text:'Trecho', value:'Trecho'},
            {text:'Trevo', value:'Trevo'},
            {text:'Vale', value:'Vale'},
            {text:'Vereda', value:'Vereda'},
            {text:'Via', value:'Via'},
            {text:'Viaduto', value:'Viaduto'},
            {text:'Viela', value:'Viela'},
            {text:'Outro', value:'OUT'},
        ],

    }},
    computed:{
        vmodel(){
            return this.value
        }
    },
}
</script>
