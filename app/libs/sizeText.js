/**
 |-----------------------
 | sizeText()
 |-----------------------
 | Break down text to a specific width by replacing whitespace with newlines
 |
 */

export default function sizeText(text, maxLength, maxLines = Infinity) {
    if (maxLength < 2) {
        // Avoid infinite loops when trying to breakdown
        // long words
        throw new Error('maxLength must be at least 2');
    }
    return text.split(/\n/)
        .map(text => {
            if (text.trim().length === 0) {
                return [''];
            }
            const lines = [];
            let next = '';
            text.split(/(\s+)/).forEach(segment => {
                if (segment.trim().length === 0) {
                    // Whitespace just goes directly on the line
                    next += segment;
                    return;
                }
                const together = (next + segment).trim();
                if (together.length <= maxLength) {
                    // If the line is still short enough, keep growing
                    next = together;
                } else {
                    // If the line would be too long, put what we've got so far
                    // into the list
                    if (next.trim().length > 0) {
                        lines.push(next.trim());
                    }
                    // If the new word is too long, break it down
                    while (segment.length > maxLength) {
                        lines.push(segment.slice(0, maxLength - 1) + '-');
                        segment = segment.slice(maxLength - 1);
                    }
                    // Whatever is left (maybe the whole word) is the beginning
                    // of our next line
                    next = segment;
                }
            });
            if (next.trim().length > 0) {
                // the last line needs added to the list
                lines.push(next.trim());
            }
            return lines;
        })
        .reduce((lines, line) => lines.concat(line), [])
        .slice(0, maxLines)
        .join("\n");
};
