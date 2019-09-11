<template>

        <v-combobox
            v-model="vmodel"
            :label="label_comp"
            :rules="vmodelRules"
            :error-messages="error_messages"
            :name="name"
            :search-input.sync="search"

            :ref="vuetify_ref"
        >
            <template v-slot:no-data>
                <v-list-tile>
                    <v-list-tile-content>
                    <v-list-tile-title>
                        Nenhum resultado para "<strong>{{ search }}</strong>".
                    </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </template>
        </v-combobox>

</template>

<script>

import {validacaoMixin} from '../mixins/jb-v-mixin-validacao'
import {inputBaseMixin} from '../mixins/jb-v-mixin-input-base'

export default {
    extends: window.Vue._VCombobox,
    mixins: [validacaoMixin, inputBaseMixin],
    data() {return{
        search:'',
    }},
    computed:{
        vmodel(){
            if(typeof this.itens[0] == 'object'){
                let result = this.$buscaItemDatatable(this.itens,this.value)
                if(result){ return result.result }
            }
            return this.value
        },
        itens(){
            return this.items
        },
        vuetify_ref(){
            return this.ref || 'v-combobox'
        }
    },
}
</script>
