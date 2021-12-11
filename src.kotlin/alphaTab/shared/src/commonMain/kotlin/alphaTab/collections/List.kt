package alphaTab.collections

public class List<T> : Iterable<T> {
    private val _data: MutableList<T>

    val length: Double
        get() = _data.size.toDouble()

    public constructor() {
        _data = ArrayList()
    }

    public constructor(vararg items: T) {
        _data = items.toMutableList()
    }

    @Suppress("UNCHECKED_CAST")
    public constructor(size: Int) {
        _data = ArrayList()
        var remaining = size
        while (remaining-- > 0) {
            _data.add(null as T)
        }
    }

    public constructor(items: Iterable<T>) {
        _data = items.toMutableList()
    }

    private constructor(items: MutableList<T>) {
        _data = items
    }

    public override fun iterator(): Iterator<T> {
        return _data.iterator()
    }

    public fun push(item: T) {
        _data.add(item)
    }

    public operator fun get(index: Int): T {
        return _data[index]
    }

    public operator fun set(index: Int, value: T) {
        _data[index] = value
    }

    public fun filter(predicate: (T) -> Boolean): List<T> {
        return List(_data.filter(predicate))
    }

    public fun indexOf(value: T): Double {
        return _data.indexOf(value).toDouble()
    }

    public fun pop(): T {
        return _data.removeLast()
    }

    public fun sort(comparison: (a: T, b: T) -> Double) {
        _data.sortWith { a, b -> comparison(a, b).toInt() }
    }

    public fun <TOut> map(transform: (v: T) -> TOut): List<TOut> {
        return List(_data.map(transform))
    }

    public fun map(transform: (v: T) -> Double): DoubleList {
        val mapped = DoubleList(_data.size)
        _data.forEachIndexed { index, item ->
            mapped[index] = transform(item)
        }
        return mapped
    }

    public fun reverse(): List<T> {
        _data.reverse()
        return this
    }

    public fun slice(): List<T> {
        return List(ArrayList(_data))
    }

    public fun slice(start: Double): List<T> {
        return List(_data.subList(start.toInt(), _data.size))
    }

    public fun splice(start: Double, deleteCount: Double, vararg newElements: T) {
        var actualStart = start.toInt()
        if (actualStart < 0)
        {
            actualStart += _data.size
        }

        _data.subList(start.toInt(), deleteCount.toInt()).clear()
        _data.addAll(start.toInt(), newElements.toList())
    }

    public fun join(separator: String): String {
        return _data.joinToString(separator)
    }
}