import { FsUpdateType } from "backend/fs/fs-mapping";
import { interfaces } from "inversify";
import { AssetCreateRequest } from "shared/api.requests";
import { FilesystemEntry } from "shared/api.types";
import { Project } from "../project";

export interface AssetContributionCapabilities {
  import?: boolean;
  create?: boolean;
}

export interface AssetInterface {
  setEntry?(entry: FilesystemEntry): Promise<void> | void;
  onFsEvent?(event: FsUpdateType, entry: FilesystemEntry | null): Promise<void> | void;
}
export interface AssetCreator {
  createAsset(project: Project, request: AssetCreateRequest): Promise<boolean>;
}

export interface AssetImporter {
  importAsset(project: Project, request: AssetCreateRequest): Promise<boolean>;
}


export const AssetContribution = Symbol('AssetContribution');
export interface AssetContribution extends Partial<AssetCreator>, Partial<AssetImporter> {
  readonly name: string;
  readonly capabilities: AssetContributionCapabilities;

  loadAsset(project: Project, assetEntry: FilesystemEntry): Promise<AssetInterface | void>;
}

export const bindAssetContribution = <T>(container: interfaces.Container, service: interfaces.Newable<T>, managerName: string) => {
  container.bind(AssetContribution).to(service).inSingletonScope().whenTargetTagged('managerName', managerName);
};