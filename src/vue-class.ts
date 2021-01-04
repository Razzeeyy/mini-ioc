import Vue from 'vue';
import type { InjectKey } from 'vue/types/options';
import { createDecorator } from 'vue-class-component';
import { APP_IOC_CONTAINER_PROVIDE_KEY, computedInjection } from './vue';

function inject(target: Object, propKey: string | symbol, newInstance: boolean) {
	if (!(target instanceof Vue) || typeof propKey === 'symbol') return true;
	createDecorator(options => {
		if (!options.inject) options.inject = {};
		else if (Array.isArray(options.inject)) {
			const vueInjectObject: { [key: string]: InjectKey } = {};
			for (const key of options.inject) {
				vueInjectObject[key] = key;
			}
			options.inject = vueInjectObject;
		}
		if (!options.computed) options.computed = {};
		options.inject[APP_IOC_CONTAINER_PROVIDE_KEY] = APP_IOC_CONTAINER_PROVIDE_KEY;
		options.computed[propKey] = computedInjection(Reflect.getMetadata('design:type', target, propKey), newInstance);
	})(target as Vue, propKey);
}

export const Inject: PropertyDecorator = (target, propKey) => inject(target, propKey, false);
export const InjectNew: PropertyDecorator = (target, propKey) => inject(target, propKey, true);
