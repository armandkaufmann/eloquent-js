export class Utility {
    static valuesToString(values) {
        let result = "";

        values.forEach((value, idx) => {
            if (typeof value === 'string') {
                result += "'" + value + "'";
            } else {
                result += value;
            }

            if (idx < values.length - 1) {
                result += ", ";
            }
        });

        return result;
    }
}