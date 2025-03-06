export class Utility {
    static valuesToString(values) {
        let result = "";

        values.forEach((value, idx) => {
            result += Utility.valueToString(value);

            if (idx < values.length - 1) {
                result += ", ";
            }
        });

        return result;
    }

    static valueToString(value) {
        if (typeof value === 'string') {
            return "'" + value + "'";
        } else {
            return value;
        }
    }
}