import React from 'react';
import classnames from 'classnames';
import { combineVisibilityFilters, visibilityFilters } from 'components/Explorer/Explorer';
import { ProjectExplorerItemContext, ProjectExplorerItemContextProvider, ProjectExplorerVisibilityFilter } from 'components/Project/ProjectExplorer/ProjectExplorer.itemContext';
import { ProjectItemProps } from 'components/Project/ProjectExplorer/ProjectExplorer.item';
import { invariant } from 'utils/invariant';
import { useExpandablePath, useItem } from 'components/Project/ProjectExplorer/ProjectExplorer.hooks';
import { assetStatus } from 'shared/api.types';
import { assetIcon, rotatingRefreshIcon } from 'constants/icons';
import s from './PackAsset.module.scss';


const visibilityFilter = combineVisibilityFilters(
  ProjectExplorerVisibilityFilter,
  visibilityFilters.hideFiles,
);

const contextOptions: Partial<ProjectExplorerItemContext> = {
  disableAssetCreate: true,
  disableAssetDelete: true,
  disableAssetRename: true,
  disableDirectoryCreate: true,
  disableDirectoryDelete: true,
  disableDirectoryRename: true,
  disableFileCreate: true,
  disableFileDelete: true,
  disableFileOpen: true,
  disableFileRename: true,
  disableEntryMove: true,
  visibilityFilter,
};

export const PackAsset = React.memo(function PackAsset(props: ProjectItemProps) {
  const { entry } = props;
  const { assetMeta } = entry.meta;

  invariant(assetMeta, 'No asset meta');

  const { renderItemChildren } = useItem(props);
  const { expanded, toggleExpanded } = useExpandablePath(entry.path, false);

  const [updating, setUpdating] = React.useState(assetMeta.manager?.data?.status === assetStatus.updating);
  React.useEffect(() => {
    setUpdating(assetMeta.manager?.data?.status === assetStatus.updating);
  }, [assetMeta.manager?.data?.status]);

  const children = renderItemChildren(visibilityFilter);

  const rootClassName = classnames(s.root, {
    [s.open]: expanded,
  });

  const icon = updating
    ? rotatingRefreshIcon
    : assetIcon;

  return (
    <div className={rootClassName}>
      <div
        className={s.name}
        onClick={toggleExpanded}
        title={`Imported from: ${assetMeta.manager?.data?.repoUrl || 'unknown'}`}
      >
        {icon}
        {entry.name}

        {assetMeta.flags.readOnly && (
          <div className={s.readonly}>
            <span>readonly</span>
          </div>
        )}
      </div>

      {expanded && (
        <div className={s.children}>
          <ProjectExplorerItemContextProvider
            options={contextOptions}
          >
            {children}
          </ProjectExplorerItemContextProvider>
        </div>
      )}
    </div>
  );
});