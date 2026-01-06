import clsx from 'clsx';
import React from 'react';
import type { BaseResourceType } from '../../types/sharedBase.types';
import type { MetaInfoField } from '../forms/forms.typs';

interface ResourceMetaInfoProps<T> {
    resourceInstance: T;
    metaInfo: MetaInfoField<T>[];
}

const ResourceMetaInfo = <T extends BaseResourceType>({ resourceInstance, metaInfo }: ResourceMetaInfoProps<T>) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow mb-3">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {metaInfo.map((info) => (
                    <RenderStaticInfo<T> key={`meta-${info.label}`} resourceInstance={resourceInstance} field={info} />
                ))}
            </dl>
        </div>
    );
};

export default ResourceMetaInfo;

export const RenderStaticInfo = <T extends BaseResourceType>({
    resourceInstance,
    field,
}: {
    resourceInstance: T;
    field: MetaInfoField<T>;
}) => {
    const rawValue = resourceInstance[field.key];
    if (rawValue === null || rawValue === undefined) {
        if (field.optional) return;
    }

    let processedValue: React.ReactNode = rawValue as React.ReactNode;

    if (field.render) {
        processedValue = field.render(resourceInstance);
    } else if (field.formatFn) {
        processedValue = field.formatFn(rawValue);
    }

    return (
        <div className={clsx(field.wide ? 'sm:col-span-2' : 'sm:col-span-1')}>
            <dt className="text-sm font-medium text-gray-500">{field.label}</dt>
            <dd className="mt-1 text-sm text-gray-900 font-mono">
                {processedValue === null ? '[NULL]' : processedValue}
            </dd>
        </div>
    );
};
