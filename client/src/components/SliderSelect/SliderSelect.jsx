import classNames from "classnames";
import { useState } from "react";
import styles from "./SliderSelect.module.scss";

const options = [
    "All",
    "Drafting",
    "Voting",
    "Keepers",
    "Payouts",
    "Punishments",
];

const SliderSelectOption = ({ label, onClick, selected }) => {
    return (
        <div
            className={classNames(
                styles.sliderOption,
                selected && styles.selected
            )}
            onClick={onClick}
        >
            {label}
        </div>
    );
};

const SliderSelect = () => {
    const [selected, setSelected] = useState("All");
    return (
        <div className={classNames(styles.sliderSelect)}>
            {options.map((option) => (
                <SliderSelectOption
                    key={option}
                    label={option}
                    selected={selected === option}
                    onClick={() => setSelected(option)}
                />
            ))}
        </div>
    );
};

export default SliderSelect;
