<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/1/18
 * Time: 13:36
 */
namespace app\tuanj\controller;

use think\Db;
use controller\BasicAdmin;
use service\DataService;

class Information extends  BasicAdmin
{
    private $dataform = 'new';

    public function index() {
        $this->title = '新闻(news)';
        list($get, $db) = [$this->request->get(), Db::name($this->dataform)];
       (isset($get['keywords']) && $get['keywords'] !== '') && $db->whereLike('time|id', "%{$get['keywords']}%");
        if (isset($get['date']) && $get['date'] !== '') {
            list($start, $end) = explode(' - ', $get['date']);
            $db->whereBetween('time', ["{$start} 00:00:00", "{$end} 23:59:59"]);
        }
        return parent::_list($db->order('time desc'));
    }

    //todo 年份
    protected function _data_filter(&$data) {
        foreach ($data as $key => $val) {
            $data[$key]['years'] = Db::name('years')->where('id', '=', $val['years'])->value('year');
        }
    }


    public function add() {
        return $this->_form($this->dataform, 'form');
    }

    public function edit() {
        return $this->_form($this->dataform, 'form');
    }

    public function del() {
        if (DataService::update($this->dataform)) {
            $this->success("删除成功!", '');
        }
        $this->error("删除失败, 请稍候再试!");
    }


    public function forbid() {
        if (DataService::update($this->dataform)) {
            $this->success("禁用成功!", '');
        }
        $this->error("禁用失败, 请稍候再试!");
    }

    /**
     * 禁用
     * @throws \think\Exception
     * @throws \think\exception\PDOException
     */
    public function resume() {
        if (DataService::update($this->dataform)) {
            $this->success("启用成功!", '');
        }
        $this->error("启用失败, 请稍候再试!");
    }



}