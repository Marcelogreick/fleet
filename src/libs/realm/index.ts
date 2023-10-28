import { createRealmContext } from "@realm/react";
import { Historic } from "./scheme/Historic";

// import { Coords } from './schemas/Coords';

// const realmAccessBehavior: Realm.OpenRealmBehaviorConfiguration = {
//   type: Realm.OpenRealmBehaviorType.OpenImmediately,
// };

// export const syncConfig: any = {
//   flexible: true,
//   newRealmFileBehavior: realmAccessBehavior,
//   existingRealmFileBehavior: realmAccessBehavior,
// };

export const { RealmProvider, useRealm, useQuery, useObject } =
  createRealmContext({
    // @ts-ignore
    schema: [Historic],
    schemaVersion: 1,
  });
