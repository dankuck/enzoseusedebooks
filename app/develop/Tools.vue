<template>
    <div style="position: absolute; width: 100%;">
        <button @click="showTools = !showTools" style="color: red">🛠️</button>
        <div v-if="showTools" style="background-color: white; width: 100%;">
            <div>
                <input type="checkbox" v-model="DevSettings.showPointsScreen" /> Show Points Screen
            </div>
            <div>
                <input type="checkbox" v-model="DevSettings.showClickSpots" /> Show Click Spots
            </div>
            <div>
                <button @click="resetWorld">Reset World</button>
            </div>
            <div>
                <input v-model="saveName" placeholder="Save Name" /> <button @click="saveWorld">Save World</button>
            </div>
            <div>
                Saves:
                <ol>
                    <li v-for="name in saveNames" :key="name">
                        <button @click="loadWorld(name)">📂</button>
                        <button @click="deleteWorld(name)">❌</button>
                        {{ name }}
                    </li>
                </ol>
            </div>
            <div>
                Show Text <textarea v-model="DevSettings.showText"></textarea>
            </div>
            <div v-if="messager.message" style="color: blue">
                » {{ messager.message || '' }}
            </div>
        </div>
    </div>
</template>

<script>
import DevSettings from '@develop/DevSettings.js';
import World from '@world/World';
import Messager from '@libs/Messager';
import reviver from '@app/reviver';
import JsonStorage from '@libs/JsonStorage';

export default {
    inject: ['app'],
    data() {
        const saveNameSaver = new JsonStorage(
            window.localStorage,
            'dev-saves'
        );
        return {
            showTools: false,
            saveNameSaver,
            saveNames: saveNameSaver.read('names') || [],
            saveName: '',
            messager: new Messager(2000),
            DevSettings,
        };
    },
    watch: {
        saveNames() {
            this.saveNameSaver.write('names', this.saveNames);
        },
    },
    methods: {
        resetWorld() {
            this.app.world = new World();
            this.messager.queue(`Reset world`);
        },
        saveWorld() {
            const storage = new JsonStorage(
                window.localStorage,
                this.saveName,
                reviver
            );
            storage.write('world', this.app.world);
            this.addSaveName(this.saveName);
            this.messager.queue(`Saved ${this.saveName}`);
            this.saveName = '';
        },
        addSaveName(name) {
            this.saveNames = Array.from(new Set(this.saveNames.concat(this.saveNameSaver.read('names') || [], name)));
        },
        removeSaveName(name) {
            this.saveNames = this.saveNames.filter(saved => saved !== name);
        },
        loadWorld(name) {
            const storage = new JsonStorage(
                window.localStorage,
                name,
                reviver
            );
            this.app.world = storage.read('world');
            this.messager.queue(`Loaded ${name}`);
        },
        deleteWorld(name) {
            if (confirm(`Delete save ${name}?`)) {
                const storage = new JsonStorage(
                    window.localStorage,
                    name,
                    reviver
                );
                storage.delete();
                this.removeSaveName(name);
                this.messager.queue(`Deleted ${name}`);
            }
        },
    },
};
</script>
