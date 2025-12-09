/**
 * 将扁平结构的权限数据数组，转换为支持无限级嵌套的树形结构数组
 * @param {Array} flatList 扁平结构的数据数组，每个元素需要包含id和parentId字段
 * @returns {Array} 转换后的树形结构数组，每个节点包含原节点的所有字段及children字段
 */
export function toTreeList(flatList) {
    // 创建一个映射来存储所有节点
    const nodeMap = new Map();
    // 结果数组
    const result = [];

    // 首先复制所有节点到映射中，并添加children属性
    flatList.forEach(item => {
        nodeMap.set(item.id, { ...item, children: [] });
    });

    // 构建树形结构
    flatList.forEach(item => {
        const node = nodeMap.get(item.id);
        if (item.parentId === null || item.parentId === undefined || item.parentId === 0) {
            // 没有父节点的项作为根节点
            result.push(node);
        } else {
            // 有父节点的项添加到父节点的children中
            const parentNode = nodeMap.get(item.parentId);
            if (parentNode) {
                parentNode.children.push(node);
            } else {
                // 如果找不到父节点，默认作为根节点处理
                result.push(node);
            }
        }
    });

    console.log(result)

    return result;
}

export default {
    toTreeList
};
