import styles from "./Page.module.scss";

import classNames from "classnames";

const Page = ({ isLoading, children }) => {
    if (isLoading) {
        return (
            <div>
                <div className={styles.loader}>
                    <div className={styles.loaderText}>
                        Loading Keeper Data...
                    </div>
                    <i
                        className={classNames(
                            "fa-duotone fa-football fa-bounce",
                            styles.loaderIcon
                        )}
                    ></i>
                </div>
            </div>
        );
    }

    return <div className={styles.page}>{children}</div>;
};

export default Page;
