
export type CheckListKey = keyof ICheckList;

interface ICheckList {
    mongo: boolean;
    express: boolean;
}

const CHECK_LIST: ICheckList = {
    mongo: false,
    express: false
};

export class DeploymentCheckList {

    public static checkService(service: CheckListKey) {
        CHECK_LIST[service] = true;

        if (DeploymentCheckList.onEverythingSetupFn) {
            const isAllSetup = DeploymentCheckList.validateEverythingIsSetup();
            isAllSetup && DeploymentCheckList.onEverythingSetupFn();
        }
    }

    public static validateEverythingIsSetup() {
        let isAllSetup = true;

        Object.entries(CHECK_LIST).forEach(([key, value]) => {
            isAllSetup = isAllSetup && value;
        });

        return isAllSetup;
    }

    static set onEverythingSetup(callback: () => void) {
        DeploymentCheckList.onEverythingSetupFn = callback;
    }

    private static onEverythingSetupFn: () => void = null;

}
