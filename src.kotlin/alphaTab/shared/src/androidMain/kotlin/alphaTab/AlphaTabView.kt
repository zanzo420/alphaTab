package alphaTab

import alphaTab.collections.DoubleList
import alphaTab.model.Score
import alphaTab.model.Track
import alphaTab.platform.android.AndroidEnvironment
import alphaTab.platform.android.AndroidUiFacade
import android.content.Context
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.graphics.drawable.Drawable
import android.util.AttributeSet
import android.widget.RelativeLayout
import androidx.recyclerview.widget.RecyclerView
import net.alphatab.R
import kotlin.contracts.ExperimentalContracts

@ExperimentalContracts
@ExperimentalUnsignedTypes
class AlphaTabView : RelativeLayout {
    private lateinit var _layoutView: RecyclerView

    private lateinit var _api: AlphaTabApiBase<AlphaTabView>

    private var _tracks: Iterable<Track>? = null
    public var tracks: Iterable<Track>?
        get() = _tracks
        set(value) {
            _tracks = value
            renderTracks()
        }

    private var _settings: Settings = Settings().apply {
        this.player.enableCursor = true
        this.player.enableCursor = true
    }

    public var settings: Settings
        get() = _settings
        set(value) {
            _settings = value
            (settingsChanged as EventEmitter).trigger()
        }

    public var settingsChanged: IEventEmitter = EventEmitter()

    private var _barCursorFillColor: Drawable = ColorDrawable(Color.argb(64, 255, 242, 0))
    public var barCursorFillColor: Drawable
        get() = _barCursorFillColor
        set(value) {
            _barCursorFillColor = value
            (barCursorFillColorChanged as EventEmitter).trigger()
        }
    public val barCursorFillColorChanged: IEventEmitter = EventEmitter()

    private var _beatCursorFillColor: Drawable = ColorDrawable(Color.argb(191, 64, 64, 255))
    public var beatCursorFillColor: Drawable
        get() = _beatCursorFillColor
        set(value) {
            _beatCursorFillColor = value
            (beatCursorFillColorChanged as EventEmitter).trigger()
        }
    public val beatCursorFillColorChanged: IEventEmitter = EventEmitter()

    public val api: AlphaTabApiBase<AlphaTabView>
        get() = _api

    constructor(context: Context, attrs: AttributeSet?) : this(context, attrs, 0)
    constructor(context: Context, attrs: AttributeSet?, defStyleAttr: Int) : super(
        context,
        attrs,
        defStyleAttr
    ) {
        init(context)
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        _api.destroy()
    }

    private fun init(context: Context) {
        AndroidEnvironment.initializeAndroid(context, resources.displayMetrics)
        inflate(context, R.layout.alphatab_view, this)
        _layoutView = findViewById(R.id.mainContentView)
        _api =
            AlphaTabApiBase(AndroidUiFacade(findViewById(R.id.screenSizeView), _layoutView), this)
    }

    public fun renderTracks() {
        val tracks = _tracks ?: return

        var score: Score? = null
        val trackIndexes = DoubleList()
        for (track in tracks) {
            if (score == null) {
                score = track.score
            }
            if (score == track.score) {
                trackIndexes.push(track.index)
            }
        }

        if (score != null) {
            _api.renderScore(score, trackIndexes)
        }
    }
}
